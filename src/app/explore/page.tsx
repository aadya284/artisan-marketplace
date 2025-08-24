"use client";

import { useState } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Filter, Search, Grid, List, Heart, Eye } from "lucide-react";
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
  }
];

const categories = ["All", "Paintings", "Textiles", "Ceramics", "Sculptures", "Jewelry", "Woodwork"];
const states = ["All States", "Bihar", "Rajasthan", "Uttar Pradesh", "West Bengal", "Odisha", "Kerala"];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All States");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());

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

  return (
    <>
      <AnimatedIndicatorNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-orange-100 to-amber-100">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Explore Authentic
              <span className="block text-orange-600">Indian Crafts</span>
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
                className="pl-10 pr-4 py-3 w-full rounded-full border-orange-200 focus:border-orange-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-orange-200 text-orange-700 hover:bg-orange-50"
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
                      ? "bg-indigo-600 hover:bg-indigo-700" 
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
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

                    {/* Featured Badge */}
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-orange-600 text-white z-10">
                        Featured
                      </Badge>
                    )}

                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                      <Badge className="absolute bottom-3 left-3 bg-green-600 text-white z-10">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs text-orange-700 border-orange-200 mb-2">
                        {product.state}
                      </Badge>
                      <Link href={`/artwork/${product.id}`}>
                        <h3 className="font-bold text-lg text-gray-800 mb-1 hover:text-orange-600 cursor-pointer transition-colors" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
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

                    {/* Add to Cart Button */}
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
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
