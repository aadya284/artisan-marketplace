"use client";

import { useState } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye, Plus, Clock, Star, Palette, Image } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample exhibitions data
const exhibitions = [
  {
    id: 1,
    title: "Madhubani Masters: Stories in Colors",
    artist: "Sita Devi & Collective",
    location: "Cultural Center, Mumbai",
    startDate: "2024-02-15",
    endDate: "2024-03-15",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Explore the vibrant world of Madhubani art through traditional and contemporary interpretations.",
    attendees: 156,
    rating: 4.8,
    status: "ongoing",
    category: "Traditional Art",
    featured: true
  },
  {
    id: 2,
    title: "Blue Pottery Renaissance",
    artist: "Kripal Singh Workshop",
    location: "Art Gallery, Jaipur",
    startDate: "2024-02-20",
    endDate: "2024-03-10",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Discover the evolution of Rajasthani blue pottery from traditional to modern designs.",
    attendees: 89,
    rating: 4.6,
    status: "upcoming",
    category: "Ceramics",
    featured: false
  },
  {
    id: 3,
    title: "Threads of Tradition: Banarasi Heritage",
    artist: "Ravi Shankar & Weavers Guild",
    location: "Textile Museum, Varanasi",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "A celebration of Banarasi silk weaving through the ages.",
    attendees: 234,
    rating: 4.9,
    status: "completed",
    category: "Textiles",
    featured: true
  },
  {
    id: 4,
    title: "Kantha Chronicles: Stitches of Bengal",
    artist: "Manju Das Collective",
    location: "Heritage Center, Kolkata",
    startDate: "2024-03-01",
    endDate: "2024-03-25",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Experience the intricate art of Kantha embroidery and its cultural significance.",
    attendees: 67,
    rating: 4.7,
    status: "upcoming",
    category: "Textiles",
    featured: false
  },
  {
    id: 5,
    title: "Sacred Scrolls: Pattachitra Traditions",
    artist: "Jagannath Mohapatra",
    location: "Temple Arts Center, Puri",
    startDate: "2024-02-25",
    endDate: "2024-03-20",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Journey through the spiritual world of Pattachitra paintings.",
    attendees: 78,
    rating: 4.8,
    status: "upcoming",
    category: "Traditional Art",
    featured: false
  },
  {
    id: 6,
    title: "Faces of Drama: Kathakali Mask Exhibition",
    artist: "Raman Nair Studio",
    location: "Performing Arts Center, Kochi",
    startDate: "2024-02-10",
    endDate: "2024-03-05",
    image: "https://images.unsplash.com/photo-1609205807107-7bb817e0b2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Discover the artistry behind traditional Kathakali masks and their cultural meanings.",
    attendees: 92,
    rating: 4.8,
    status: "ongoing",
    category: "Performing Arts",
    featured: true
  }
];

const categories = ["All", "Traditional Art", "Textiles", "Ceramics", "Performing Arts", "Sculptures"];
const statusFilters = ["All", "ongoing", "upcoming", "completed"];

export default function ExhibitionPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const matchesCategory = selectedCategory === "All" || exhibition.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || exhibition.status === selectedStatus;
    const matchesSearch = exhibition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exhibition.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-green-600";
      case "upcoming": return "bg-blue-600";
      case "completed": return "bg-gray-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ongoing": return "Live Now";
      case "upcoming": return "Coming Soon";
      case "completed": return "Completed";
      default: return status;
    }
  };

  return (
    <>
      <AnimatedIndicatorNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Art Exhibitions &
              <span className="block text-purple-600">Cultural Showcases</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Join exclusive exhibitions, meet talented artisans, and immerse yourself in India's rich cultural heritage.
            </p>
            
            {/* CTA for Artists */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Organize Exhibition
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-purple-200 text-purple-700 hover:bg-purple-50 font-bold px-8 py-3"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <Palette className="w-5 h-5 mr-2" />
                Artist Portal
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search exhibitions or artists..."
                className="pl-10 pr-4 py-3 w-full rounded-full border-purple-200 focus:border-purple-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="text-3xl font-bold text-purple-600" style={{ fontFamily: 'Rajdhani, sans-serif' }}>24+</h3>
                <p className="text-gray-600">Active Exhibitions</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-indigo-600" style={{ fontFamily: 'Rajdhani, sans-serif' }}>150+</h3>
                <p className="text-gray-600">Featured Artists</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary" style={{ fontFamily: 'Rajdhani, sans-serif' }}>5K+</h3>
                <p className="text-gray-600">Visitors Monthly</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Rajdhani, sans-serif' }}>98%</h3>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">Categories:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "border-purple-200 text-purple-700 hover:bg-purple-50"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">Status:</span>
                {statusFilters.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className={selectedStatus === status 
                      ? "bg-indigo-600 hover:bg-indigo-700" 
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    }
                  >
                    {status === "All" ? status : getStatusText(status)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Exhibitions Grid */}
        <section className="py-12">
          <div className="container mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {filteredExhibitions.length} Exhibitions Available
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredExhibitions.map((exhibition) => (
                <div 
                  key={exhibition.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative">
                    <img 
                      src={exhibition.image} 
                      alt={exhibition.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Status Badge */}
                    <Badge className={`absolute top-3 left-3 ${getStatusColor(exhibition.status)} text-white`}>
                      {getStatusText(exhibition.status)}
                    </Badge>

                    {/* Featured Badge */}
                    {exhibition.featured && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                        Featured
                      </Badge>
                    )}

                    {/* View Count */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {exhibition.attendees}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs text-purple-700 border-purple-200 mb-2">
                        {exhibition.category}
                      </Badge>
                      <h3 className="font-bold text-xl text-gray-800 mb-2 leading-tight" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {exhibition.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        by {exhibition.artist}
                      </p>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {exhibition.description}
                    </p>

                    {/* Location and Date */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        {exhibition.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Rating and Attendees */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{exhibition.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {exhibition.attendees} interested
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {exhibition.status === "ongoing" ? "Visit Exhibition" : 
                         exhibition.status === "upcoming" ? "Reserve Spot" : "View Gallery"}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image className="w-4 h-4 mr-2" />
                        View Portfolio
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredExhibitions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Palette className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No exhibitions found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </section>

        {/* Artist Call-to-Action */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Are You an Artist?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Showcase your work, connect with art lovers, and expand your reach through our exhibition platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-8 py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Your Exhibition
              </Button>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold px-8 py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>

      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}
