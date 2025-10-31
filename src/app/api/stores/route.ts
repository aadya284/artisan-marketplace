import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Use a relative import here to avoid editor/TS path-mapping issues in some setups.
import { prisma } from '../../../lib/prisma';
import SAMPLE_STORES from '../../../lib/sample-stores';

type LatLng = { lat: number; lng: number };

type Store = {
  id: string; // place_id
  placeId: string;
  name: string;
  position: LatLng;
  address: string;
  rating: number;
  userRatingsTotal?: number;
  openingHours?: string;
  contact?: string;
  website?: string;
  craftTypes: string[];
  reviews?: Array<{
    authorName?: string;
    rating?: number;
    text?: string;
    relativeTime?: string;
  }>;
};

const PUNE_CENTER: LatLng = { lat: 18.5204, lng: 73.8567 };

// Basic in-memory cache for 15 minutes
const cache: Record<string, { expiresAt: number; data: Store[] }> = {};

function getApiKey() {
  // Only use the server-side key for Places API (New)
  const key = process.env.GOOGLE_MAPS_API_KEY || '';
  if (!key) {
    console.error('Missing GOOGLE_MAPS_API_KEY environment variable');
    return '';
  }
  // Masked debug output
  try {
    if (process.env.DEBUG === 'true') {
      const masked = '***' + String(key).slice(-6);
      console.error(`DEBUG: Using Places API key (masked) ${masked}`);
    }
  } catch (e) {}
  return key;
}

function toMeters(km: number) { return Math.round(km * 1000); }

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = params.get('lat');
  const lng = params.get('lng');
  const radiusKm = Number(params.get('radiusKm') || '15');
  const city = (params.get('city') || 'pune').toLowerCase();
  const keyword = params.get('keyword') || 'handicraft artisan craft pottery textile';

  const center: LatLng = lat && lng ? { lat: Number(lat), lng: Number(lng) } : (city === 'pune' ? PUNE_CENTER : PUNE_CENTER);
  const radius = toMeters(radiusKm);

  // 1) Try DB first (within radius)
  try {
    const dbStores = await prisma.store.findMany();
    if (dbStores.length > 0) {
      // Filter out DB rows that don't have lat/lng and compute Haversine distance safely
  const inRadius = dbStores.filter((s: any) => {
        if (typeof s.lat !== 'number' || typeof s.lng !== 'number') return false;
        const dLat = (s.lat - center.lat) * Math.PI / 180;
        const dLng = (s.lng - center.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) ** 2 + Math.cos(center.lat*Math.PI/180) * Math.cos(s.lat*Math.PI/180) * Math.sin(dLng/2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const km = 6371 * c;
        return km * 1000 <= radius;
      });
      if (inRadius.length > 0) {
  const shaped = await Promise.all(inRadius.map(async (s: any) => {
          const reviews = await prisma.review.findMany({ where: { storeId: s.id }, orderBy: { createdAt: 'desc' }, take: 3 });
          return {
            id: s.id,
            placeId: s.placeId,
            name: s.name,
            position: { lat: s.lat, lng: s.lng },
            address: s.address,
            rating: s.rating,
            userRatingsTotal: s.userRatingsTotal,
            openingHours: s.openingHours || undefined,
            contact: s.contact || undefined,
            website: s.website || undefined,
            craftTypes: (s.craftTypes || '').split(',').filter(Boolean),
            reviews: reviews.map((r: any) => ({ authorName: r.authorName || undefined, rating: r.rating || undefined, text: r.text || undefined, relativeTime: r.relativeTime || undefined })),
          } as Store;
        }));
        return NextResponse.json({ stores: shaped });
      }
    }
  } catch {}

  const cacheKey = `${center.lat},${center.lng}:${radius}:${keyword}`;
  const now = Date.now();
  const cached = cache[cacheKey];
  if (cached && cached.expiresAt > now) {
    return NextResponse.json({ stores: cached.data }, { headers: { 'Cache-Control': 'public, max-age=300' } });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Google Maps API key' }, { status: 500 });
  }

  // Nearby Search using the new Places API (v1) — prefer modern endpoint but keep defensive parsing
  // New endpoint: POST https://places.googleapis.com/v1/places:searchNearby
  const nearbyEndpoint = 'https://places.googleapis.com/v1/places:searchNearby';
  // Complete field mask for all the data we need
  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.googleMapsUri',
    'places.primaryType',
    'places.types',
    'places.websiteUri',
    'places.currentOpeningHours',
    'places.regularOpeningHours',
    'places.rating',
    'places.userRatingCount',
    'places.reviews',
    'places.photos',
    'places.internationalPhoneNumber',
    'places.nationalPhoneNumber'
  ].join(',');

  let nearbyJson: any = null;
  try {
    console.log('Fetching from Places API...', {
      center,
      radius,
      fieldMask
    });
    
    const resp = await fetch(nearbyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify({
        includedTypes: [
          "art_gallery",
          "home_goods_store", 
          "store",
          "museum",
          "shopping_mall",  // Added more relevant types
          "gift_shop",
          "jewelry_store",
          "furniture_store"
        ],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: center.lat, longitude: center.lng },
            radius: Math.min(Number(radius), 50000), // Cap at 50km (Places API limit)
          }
        },
        rankPreference: "DISTANCE"  // Sort by distance from center
      })
    });
    nearbyJson = await resp.json(); // Fixed: removed const to use outer variable
    
    if (!resp.ok) {
      console.error('Places API Error:', {
        status: resp.status,
        statusText: resp.statusText,
        body: nearbyJson
      });
      return NextResponse.json({
        error: 'Places API request failed',
        googleStatus: resp.status,
        googleMessage: nearbyJson.error?.message || 'Unknown error',
        details: nearbyJson
      }, { status: 502 });
    }
  } catch (err) {
    console.error('Places Nearby Search (new API) request error', err);
    return NextResponse.json({
      error: 'Failed to fetch from Places API',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }

  // Accept multiple shapes: the new API returns { places: [...] } while legacy returned { results: [...], status }
  console.log('Places API response:', { 
    hasPlaces: !!nearbyJson?.places, 
    placesLength: nearbyJson?.places?.length || 0
  });

  if (!nearbyJson || (Array.isArray(nearbyJson.places) ? nearbyJson.places.length === 0 : (nearbyJson.status && nearbyJson.status !== 'OK' && nearbyJson.status !== 'ZERO_RESULTS'))) {
    // If the new API failed or returned nothing, try to surface the error details (if any) and fall back to sample data
    console.log('No results from Places API, checking for errors...');
    if (nearbyJson && nearbyJson.error) {
      console.error('Places API error:', nearbyJson.error);
      // Don't return error response, let it fall through to sample data
    }
    // Return sample data immediately if Places API returned no results
    if (SAMPLE_STORES && SAMPLE_STORES.length > 0) {
      console.log('Returning sample data as fallback (no Places API results)');
      return NextResponse.json({ stores: SAMPLE_STORES, fallback: 'sample-data' }, { headers: { 'Cache-Control': 'public, max-age=300' } });
    }
  }

  const places: any[] = Array.isArray(nearbyJson?.places) ? nearbyJson.places : (nearbyJson?.results || []);

  // Fetch place details with limited concurrency
  const concurrency = 5;
  const detailFetches: Array<() => Promise<Store | null>> = places.map((p: any) => async () => {
      try {
      // Use the new Place Details endpoint: GET https://places.googleapis.com/v1/places/{place_id}
      // The new API may return resource names like "places/PLACE_ID" — extract the id if needed.
      let placeId = p.place_id || p.placeId || p.name || null;
      if (typeof placeId === 'string' && placeId.startsWith('places/')) {
        placeId = placeId.split('/').pop();
      }
      if (!placeId) return null;

      const detailsUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(String(placeId))}`;
      // prefer readMask param as well as header for compatibility
      const readMask = [
        'id',
        'displayName',
        'formattedAddress',
        'location',
        'googleMapsUri',
        'primaryType',
        'types',
        'websiteUri',
        'currentOpeningHours',
        'regularOpeningHours',
        'rating',
        'userRatingCount',
        'reviews',
        'photos',
        'internationalPhoneNumber',
        'nationalPhoneNumber'
      ].join(',');
      const res = await fetch(`${detailsUrl}?readMask=${encodeURIComponent(readMask)}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': readMask,
        }
      });
      const json = await res.json();
      // The new API may wrap the place in a `place` field or return it directly — handle both
      const d = json.place || json;
      
      // Extract location from the new Places API v1 format
      let lat: number | null = null;
      let lng: number | null = null;
      
      if (d.location) {
        // New Places API v1 format
        lat = Number(d.location.latitude);
        lng = Number(d.location.longitude);
      } else if (d.geometry?.location) {
        // Legacy format (fallback)
        lat = Number(d.geometry.location.lat);
        lng = Number(d.geometry.location.lng);
      }
      
      if (Number.isNaN(lat) || Number.isNaN(lng) || lat === null || lng === null) {
        console.error('Invalid location data:', { d, lat, lng });
        return null;
      }
      // Map fields from Places API v1 to our Store shape
      const resolvedPlaceId = (d.name && String(d.name).split('/').pop()) || placeId;
      const name = d.displayName?.text || d.displayName || resolvedPlaceId;
      const address = d.formattedAddress || '';
      const rating = d.rating || 0;
      const userRatingsTotal = d.userRatingCount || 0; // Use the new field name from Places API v1
      const openingHours = d.currentOpeningHours?.weekdayDescriptions?.join(' | ') || undefined;
      const contact = d.internationalPhoneNumber || d.nationalPhoneNumber;
      const website = d.websiteUri || undefined;
      
      console.log('Place details:', {
        name,
        address,
        location: { lat, lng },
        rating,
        userRatingsTotal
      });
      const reviewsArr = d.reviews || d.places?.reviews || [];
      const store: Store = {
        id: resolvedPlaceId,
        placeId: resolvedPlaceId,
        name: name || resolvedPlaceId,
        position: { lat, lng },
        address: address || '',
        rating: Number(rating) || 0,
        userRatingsTotal: Number(userRatingsTotal) || 0,
        openingHours,
        contact,
        website,
        craftTypes: inferCraftTypes(String(name || '')),
        reviews: (reviewsArr || []).slice(0, 3).map((r: any) => ({
          authorName: r.author || r.author_name || r.authorName,
          rating: r.rating || r.stars || undefined,
          text: r.text || r.comment || undefined,
          relativeTime: r.relative_time_description || r.relativeTime || undefined,
        }))
      };
      return store;
    } catch (err) {
      try { console.error('store details fetch error', err); } catch (e) {}
      return null;
    }
  });

  const results: Store[] = [];
  let idx = 0;
  while (idx < detailFetches.length) {
    const batch = detailFetches.slice(idx, idx + concurrency).map((fn) => fn());
    const batchResults = await Promise.all(batch);
    for (const s of batchResults) { if (s) results.push(s); }
    idx += concurrency;
  }

  cache[cacheKey] = { data: results, expiresAt: now + 15 * 60 * 1000 };

  // Upsert in DB (best-effort)
  try {
    for (const s of results) {
      const craft = s.craftTypes.join(',');
      const db = await prisma.store.upsert({
        where: { placeId: s.placeId },
        create: { placeId: s.placeId, name: s.name, address: s.address, lat: s.position.lat, lng: s.position.lng, rating: s.rating, userRatingsTotal: s.userRatingsTotal || 0, openingHours: s.openingHours, contact: s.contact, website: s.website, craftTypes: craft },
        update: { name: s.name, address: s.address, lat: s.position.lat, lng: s.position.lng, rating: s.rating, userRatingsTotal: s.userRatingsTotal || 0, openingHours: s.openingHours, contact: s.contact, website: s.website, craftTypes: craft },
      });
      if (s.reviews && s.reviews.length) {
        await prisma.review.deleteMany({ where: { storeId: db.id } });
        for (const r of s.reviews) {
          await prisma.review.create({ data: { storeId: db.id, authorName: r.authorName, rating: r.rating ? Math.round(r.rating) : null, text: r.text, relativeTime: r.relativeTime } });
        }
      }
    }
  } catch {}

  // If we couldn't find any live places (Google + DB returned empty), return local sample data as a fallback
  console.log('Results check:', { resultsLength: results?.length || 0, hasSampleStores: !!SAMPLE_STORES?.length });
  if ((!results || !Array.isArray(results) || results.length === 0) && SAMPLE_STORES && SAMPLE_STORES.length > 0) {
    console.log('Returning sample data as fallback');
    return NextResponse.json({ stores: SAMPLE_STORES, fallback: 'sample-data' }, { headers: { 'Cache-Control': 'public, max-age=300' } });
  }

  return NextResponse.json({ stores: results }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}

// Helper to infer simple craft tags from name
function inferCraftTypes(name: string): string[] {
  const lower = name.toLowerCase();
  const tags: string[] = [];
  if (/(potter|ceramic|clay)/.test(lower)) tags.push('pottery');
  if (/(textile|fabric|weav|silk|khadi|saree)/.test(lower)) tags.push('textiles');
  if (/(jewel|silver|gold|bead)/.test(lower)) tags.push('jewelry');
  if (/(wood|carv|bamboo|cane)/.test(lower)) tags.push('woodwork');
  if (tags.length === 0) tags.push('handicraft');
  return tags;
}

export async function POST() {
  return NextResponse.json({ error: 'Not Implemented' }, { status: 501 });
}