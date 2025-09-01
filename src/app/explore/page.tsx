"use client";

import { useState, useEffect } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Filter, Search, Grid, List, Heart, Eye, MapPin, Navigation, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Sample products data
const products = [
  {
    id: 1,
    name: "Hand-Painted Madhubani Art",
    artist: "Sita Devi",
    state: "Bihar",
    price: 4500,
    originalPrice: 6000,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Paintings",
    featured: true
  },
  {
    id: 2,
    name: "Blue Pottery Decorative Bowl",
    artist: "Kripal Singh",
    state: "Rajasthan",
    price: 2200,
    originalPrice: 2800,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Ceramics",
    featured: false
  },
  {
    id: 3,
    name: "Banarasi Silk Saree",
    artist: "Ravi Shankar",
    state: "Uttar Pradesh",
    price: 25000,
    originalPrice: 30000,
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Textiles",
    featured: true
  },
  {
    id: 4,
    name: "Kantha Embroidered Scarf",
    artist: "Manju Das",
    state: "West Bengal",
    price: 1800,
    originalPrice: 2400,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Textiles",
    featured: false
  },
  {
    id: 5,
    name: "Pattachitra Palm Leaf Art",
    artist: "Jagannath Mohapatra",
    state: "Odisha",
    price: 3500,
    originalPrice: 4200,
    rating: 4.7,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Paintings",
    featured: false
  },
  {
    id: 6,
    name: "Kathakali Mask Collection",
    artist: "Raman Nair",
    state: "Kerala",
    price: 5500,
    originalPrice: 7000,
    rating: 4.8,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1609205807107-7bb817e0b2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Sculptures",
    featured: true
  },
  {
    id: 7,
    name: "Tanjore Painting",
    artist: "Lakshmi Narayan",
    state: "Tamil Nadu",
    price: 8500,
    originalPrice: 10000,
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Paintings",
    featured: true
  },
  {
    id: 8,
    name: "Chikankari Kurti",
    artist: "Fatima Khan",
    state: "Uttar Pradesh",
    price: 2800,
    originalPrice: 3500,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Textiles",
    featured: false
  },
  {
    id: 9,
    name: "Warli Wall Art",
    artist: "Bhavana Patil",
    state: "Maharashtra",
    price: 3200,
    originalPrice: 4000,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Paintings",
    featured: false
  },
  {
    id: 10,
    name: "Phulkari Dupatta",
    artist: "Harpreet Kaur",
    state: "Punjab",
    price: 1950,
    originalPrice: 2500,
    rating: 4.5,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Textiles",
    featured: false
  },
  {
    id: 11,
    name: "Bandhani Silk Saree",
    artist: "Kiran Bhai",
    state: "Gujarat",
    price: 6500,
    originalPrice: 8000,
    rating: 4.8,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Textiles",
    featured: true
  },
  {
    id: 12,
    name: "Brass Dhokra Art",
    artist: "Ravi Bastar",
    state: "Chhattisgarh",
    price: 4200,
    originalPrice: 5000,
    rating: 4.6,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1609205807107-7bb817e0b2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Sculptures",
    featured: false
  }
];

const categories = ["All", "Paintings", "Textiles", "Ceramics", "Sculptures", "Jewelry", "Woodwork"];
const states = ["All States", "Bihar", "Rajasthan", "Uttar Pradesh", "West Bengal", "Odisha", "Kerala", "Tamil Nadu", "Maharashtra", "Punjab", "Gujarat", "Chhattisgarh"];

// State coordinate mapping for location detection
const stateCoordinates = {
  "Maharashtra": { lat: 19.7515, lng: 75.7139 },
  "Karnataka": { lat: 15.3173, lng: 75.7139 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
  "Kerala": { lat: 10.8505, lng: 76.2711 },
  "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
  "Telangana": { lat: 18.1124, lng: 79.0193 },
  "Gujarat": { lat: 23.0225, lng: 72.5714 },
  "Rajasthan": { lat: 27.0238, lng: 74.2179 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Bihar": { lat: 25.0961, lng: 85.3131 },
  "West Bengal": { lat: 22.9868, lng: 87.8550 },
  "Odisha": { lat: 20.9517, lng: 85.0985 },
  "Jharkhand": { lat: 23.6102, lng: 85.2799 },
  "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
  "Punjab": { lat: 31.1471, lng: 75.3412 },
  "Haryana": { lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "Assam": { lat: 26.2006, lng: 92.9376 },
  "Tripura": { lat: 23.9408, lng: 91.9882 },
  "Meghalaya": { lat: 25.4670, lng: 91.3662 },
  "Manipur": { lat: 24.6637, lng: 93.9063 },
  "Mizoram": { lat: 23.1645, lng: 92.9376 },
  "Nagaland": { lat: 26.1584, lng: 94.5624 },
  "Arunachal Pradesh": { lat: 28.2180, lng: 94.7278 },
  "Sikkim": { lat: 27.5330, lng: 88.5122 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Delhi": { lat: 28.7041, lng: 77.1025 }
};

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All States");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  // Location detection states
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [detectedState, setDetectedState] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Detect state from coordinates
  const detectStateFromCoordinates = (latitude: number, longitude: number) => {
    let closestState = "";
    let minDistance = Infinity;

    Object.entries(stateCoordinates).forEach(([state, coords]) => {
      const distance = calculateDistance(latitude, longitude, coords.lat, coords.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestState = state;
      }
    });

    return closestState;
  };

  // Enable location detection
  const enableLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      return;
    }

    setIsDetectingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const state = detectStateFromCoordinates(latitude, longitude);

        setDetectedState(state);
        setLocationEnabled(true);
        setIsDetectingLocation(false);

        // Don't auto-select the detected state - keep showing all products
      },
      (error) => {
        setIsDetectingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Disable location detection
  const disableLocation = () => {
    setLocationEnabled(false);
    setDetectedState("");
    setLocationError("");
    // Only reset state filter if it was set to the detected state
    if (selectedState === detectedState) {
      setSelectedState("All States");
    }
  };

  const toggleFavorite = (productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesState = selectedState === "All States" || product.state === selectedState;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesState && matchesSearch;
  });

  // Get local products from detected state (for the special local section)
  const localProducts = locationEnabled && detectedState
    ? products.filter(product => product.state === detectedState)
    : [];

  // Helper function to check if a product is local
  const isLocalProduct = (product: any) => {
    return locationEnabled && detectedState && product.state === detectedState;
  };

  return (
    <>
      <AnimatedIndicatorNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-amber-100 to-amber-200">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Explore Authentic
              <span className="block text-amber-600">Indian Crafts</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Discover handcrafted treasures from talented artisans across India. Each piece tells a story of tradition and craftsmanship.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search crafts, artists, or states..."
                className="pl-10 pr-4 py-3 w-full rounded-full border-amber-200 focus:border-amber-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Location-based Discovery */}
        <section className="py-8 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  <MapPin className="inline-block w-6 h-6 mr-2 text-green-600" />
                  Discover Local Artworks
                </h2>
                <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {locationEnabled && detectedState
                    ? `Showing artworks from ${detectedState} - your local region`
                    : "Enable location to discover beautiful artworks from artisans in your state"
                  }
                </p>
                {locationError && (
                  <p className="text-red-600 text-sm mt-2">{locationError}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {locationEnabled && detectedState && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                    <Navigation className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-medium text-green-700">{detectedState}</span>
                  </div>
                )}

                {!locationEnabled ? (
                  <Button
                    onClick={enableLocation}
                    disabled={isDetectingLocation}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isDetectingLocation ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
                        Enable Location
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={disableLocation}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Disable Location
                  </Button>
                )}
              </div>
            </div>

            {/* Local Artworks Preview */}
            {locationEnabled && detectedState && localProducts.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Artworks from {detectedState} ({localProducts.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedState(detectedState)}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    View All Local Artworks
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {localProducts.slice(0, 4).map((product) => (
                    <Link key={product.id} href={`/artwork/${product.id}`}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-green-600 text-white text-xs">
                              Local
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm text-gray-800 mb-1 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">by {product.artist}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">₹{product.price.toLocaleString()}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {locationEnabled && detectedState && localProducts.length === 0 && (
              <div className="mt-8 text-center py-8 bg-white rounded-lg">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No local artworks found</h3>
                <p className="text-gray-500">
                  We don't have artworks from {detectedState} yet, but check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-3 flex items-center">Categories:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "border-amber-200 text-amber-700 hover:bg-amber-50"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* State Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-3 flex items-center">States:</span>
                {states.slice(0, 4).map((state) => (
                  <Button
                    key={state}
                    variant={selectedState === state ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedState(state)}
                    className={selectedState === state 
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "border-amber-200 text-amber-700 hover:bg-amber-50"
                    }
                  >
                    {state}
                  </Button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {filteredProducts.length} Products Found
                {locationEnabled && detectedState && (
                  <div className="flex gap-2 ml-3">
                    {selectedState === detectedState ? (
                      <Badge className="bg-green-100 text-green-800">
                        <MapPin className="w-3 h-3 mr-1" />
                        Showing Local Artworks Only
                      </Badge>
                    ) : selectedState === "All States" ? (
                      <Badge className="bg-blue-100 text-blue-800">
                        <MapPin className="w-3 h-3 mr-1" />
                        {localProducts.length} Local + {filteredProducts.length - localProducts.length} Other States
                      </Badge>
                    ) : null}
                  </div>
                )}
              </h2>
            </div>

            <div className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
            }`}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                    <Link href={`/artwork/${product.id}`} className="block">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${viewMode === "list" ? "w-full h-48" : "w-full h-64"}`}
                      />

                      {/* View Details Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button className="bg-white text-gray-800 hover:bg-gray-100">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </Link>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>

                    {/* Featured and Local Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {product.featured && (
                        <Badge className="bg-amber-600 text-white text-xs">
                          Featured
                        </Badge>
                      )}
                      {isLocalProduct(product) && (
                        <Badge className="bg-green-600 text-white text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          Local
                        </Badge>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                      <Badge className="absolute bottom-3 left-3 bg-red-600 text-white z-10">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-200 mb-2">
                        {product.state}
                      </Badge>
                      <Link href={`/artwork/${product.id}`}>
                        <h3 className="font-bold text-lg text-gray-800 mb-1 hover:text-amber-600 cursor-pointer transition-colors" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        by {product.artist}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Link href={`/artwork/${product.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold"
                          style={{ fontFamily: 'Rajdhani, sans-serif' }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}
