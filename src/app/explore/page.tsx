"use client";

import { useState, useEffect } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Grid, List, Heart, Eye, MapPin, Navigation, Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Categories & States
const categories = ["All", "Paintings", "Textiles", "Ceramics", "Sculptures", "Jewelry", "Woodwork"];
const states = ["All States", "Bihar", "Rajasthan", "Uttar Pradesh", "West Bengal", "Odisha", "Kerala", "Tamil Nadu", "Maharashtra", "Punjab", "Gujarat", "Chhattisgarh"];

export default function ExplorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All States");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  // Location states
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [detectedState, setDetectedState] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ✅ Fetch artworks from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("🔄 Fetching artworks data...");
      try {
        if (!db) {
          throw new Error("Firestore DB instance not initialized");
        }
        
        const artworksRef = collection(db, "artworks");
        console.log("📑 Querying 'artworks' collection...");
        
        const querySnapshot = await getDocs(artworksRef);
        console.log(`✅ Retrieved ${querySnapshot.size} artworks`);
        
        const fetchedProducts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(`📄 Artwork document ${doc.id}:`, data);
          return {
            id: doc.id,
            ...data,
          };
        });
        
        setProducts(fetchedProducts);
        console.log("✨ Successfully updated products state with", fetchedProducts.length, "items");
      } catch (error) {
        console.error("❌ Error fetching artworks:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
          console.error("Stack trace:", error.stack);
        }
      } finally {
        setLoading(false);
        console.log("🏁 Finished loading artworks data");
      }
    };

    fetchProducts();
  }, []);

  // 🔁 Favorites toggle
  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(productId) ? newFavorites.delete(productId) : newFavorites.add(productId);
    setFavorites(newFavorites);
  };

  // 🔎 Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesState = selectedState === "All States" || product.state === selectedState;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesState && matchesSearch;
  });

  // 🧭 Location detection (same logic)
  const enableLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by browser");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simple placeholder for now
        setDetectedState("Maharashtra");
        setLocationEnabled(true);
        setIsDetectingLocation(false);
      },
      () => {
        setIsDetectingLocation(false);
        setLocationError("Unable to fetch location.");
      }
    );
  };

  const disableLocation = () => {
    setLocationEnabled(false);
    setDetectedState("");
    setLocationError("");
  };

  // 🧾 UI Rendering
  return (
    <>
      <AnimatedIndicatorNavbar />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-amber-100 to-amber-200">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-gray-800" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Explore Authentic <span className="block text-amber-600">Indian Crafts</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: "Poppins, sans-serif" }}>
              Discover handcrafted treasures from talented artisans across India.
            </p>
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

        {/* Filters Section */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-3">Categories:</span>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-amber-600 text-white" : "border-amber-200 text-amber-700"}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* States */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-3">States:</span>
              {states.slice(0, 4).map((state) => (
                <Button
                  key={state}
                  size="sm"
                  variant={selectedState === state ? "default" : "outline"}
                  onClick={() => setSelectedState(state)}
                  className={selectedState === state ? "bg-amber-600 text-white" : "border-amber-200 text-amber-700"}
                >
                  {state}
                </Button>
              ))}
            </div>

            {/* View & Location */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Location</span>
                <Switch
                  checked={locationEnabled}
                  onCheckedChange={(checked) => (checked ? enableLocation() : disableLocation())}
                  className="data-[state=checked]:bg-amber-600"
                />
                {locationEnabled && <span className="text-xs text-amber-700">({detectedState})</span>}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
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
            {loading ? (
              <div className="text-center py-16">
                <Loader className="w-6 h-6 animate-spin mx-auto mb-3" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition">
                    <Link href={`/artwork/${product.id}`} className="block relative">
                      <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Button className="bg-white text-gray-800 hover:bg-gray-100">
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </Button>
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">by {product.artist}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-700">₹{product.price}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <NewsletterFooter />
        <AiChatbotWidget />
      </div>
    </>
  );
}
