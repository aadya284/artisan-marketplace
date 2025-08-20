"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ShoppingCart } from "lucide-react";

// State craft data with cultural information
const stateCrafts = {
  "uttar-pradesh": {
    name: "Uttar Pradesh",
    craft: "Banarasi Silk",
    icon: "��",
    description: "Luxurious silk sarees with intricate gold and silver brocade work",
    artisan: "Masterji Ravi Shankar",
    artisanStory: "A third-generation weaver from Varanasi, Ravi Shankar has dedicated his life to preserving the ancient art of Banarasi silk weaving. His family workshop has been creating exquisite sarees for over 80 years.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "₹15,000 - ₹50,000",
    rating: 4.9,
    color: "#FF9933" // Saffron
  },
  "bihar": {
    name: "Bihar",
    craft: "Madhubani",
    icon: "🎨",
    description: "Traditional folk paintings with vibrant colors and intricate patterns",
    artisan: "Sita Devi",
    artisanStory: "Sita Devi is a renowned Madhubani artist from Mithila. Her paintings tell stories of Hindu mythology and daily life, using natural pigments and traditional techniques passed down through generations.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "₹2,000 - ₹25,000",
    rating: 4.8,
    color: "#4B0082" // Indigo
  },
  "rajasthan": {
    name: "Rajasthan",
    craft: "Blue Pottery",
    icon: "🏺",
    description: "Traditional ceramic art with distinctive blue and white patterns",
    artisan: "Kripal Singh",
    artisanStory: "From the Pink City of Jaipur, Kripal Singh continues the 300-year-old tradition of blue pottery. His workshops blend Persian techniques with Rajasthani artistry, creating stunning decorative pieces.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "₹500 - ₹8,000",
    rating: 4.7,
    color: "#CD853F" // Terracotta
  },
  "andhra-pradesh": {
    name: "Andhra Pradesh",
    craft: "Kalamkari",
    icon: "🖌️", 
    description: "Hand-painted textiles with natural dyes and mythological themes",
    artisan: "Venkataswamy",
    artisanStory: "A master Kalamkari artist from Srikalahasti, Venkataswamy has spent over 40 years perfecting this ancient art form. His work depicts epic tales from Hindu mythology.",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "₹3,000 - ₹20,000",
    rating: 4.9,
    color: "#FF9933" // Saffron
  },
  "odisha": {
    name: "Odisha",
    craft: "Pattachitra",
    icon: "🖼���",
    description: "Traditional scroll paintings depicting religious themes and folk tales",
    artisan: "Jagannath Mohapatra",
    artisanStory: "From the temple town of Puri, Jagannath creates intricate Pattachitra paintings on palm leaves and cloth. His family has been practicing this art for seven generations.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "₹1,500 - ₹12,000",
    rating: 4.8,
    color: "#4B0082" // Indigo
  },
  "west-bengal": {
    name: "West Bengal",
    craft: "Kantha Embroidery",
    icon: "🧵",
    description: "Traditional embroidery with running stitches creating beautiful patterns",
    artisan: "Manju Das",
    artisanStory: "A skilled artisan from rural Bengal, Manju Das transforms old sarees into beautiful Kantha quilts and scarves using traditional running stitch techniques.",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "₹800 - ₹5,000",
    rating: 4.6,
    color: "#CD853F" // Terracotta
  },
  "kerala": {
    name: "Kerala",
    craft: "Coir Products",
    icon: "🥥",
    description: "Eco-friendly products made from coconut fiber",
    artisan: "Raman Nair",
    artisanStory: "From the backwaters of Kerala, Raman Nair creates beautiful coir products including mats, rugs, and decorative items using traditional coconut fiber processing techniques.",
    image: "https://images.unsplash.com/photo-1609205807107-7bb817e0b2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "₹200 - ₹3,000",
    rating: 4.5,
    color: "#FF9933" // Saffron
  }
};

const InteractiveIndiaMap = () => {
  const [selectedState, setSelectedState] = useState<string | null>("rajasthan");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const selectedCraft = selectedState ? stateCrafts[selectedState as keyof typeof stateCrafts] : null;

  return (
    <section className="py-32 bg-gradient-to-br from-orange-50 via-blue-50 to-amber-50 relative overflow-hidden">
      {/* Subtle Indian motifs background */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='paisley' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M30,15 Q20,5 10,15 Q15,25 30,15 Z' fill='%23FF9933' fill-opacity='0.08'/%3E%3Cpath d='M50,35 Q40,25 30,35 Q35,45 50,35 Z' fill='%234B0082' fill-opacity='0.06'/%3E%3Ccircle cx='45' cy='10' r='3' fill='%23CD853F' fill-opacity='0.05'/%3E%3Ccircle cx='15' cy='50' r='2' fill='%23FF9933' fill-opacity='0.07'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23paisley)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Additional decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-10">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-amber-600 blur-xl"></div>
      </div>
      <div className="absolute bottom-20 right-20 w-32 h-32 opacity-8">
        <div className="w-full h-full rounded-full bg-gradient-to-tl from-indigo-500 to-purple-600 blur-2xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm">
            <MapPin className="w-4 h-4 mr-2" />
            Explore Indian Crafts
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Discover India's Rich
            <span className="block text-orange-600">Cultural Heritage</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Click on any state to explore traditional crafts, meet local artisans, and support cultural preservation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Interactive Map of India
              </h3>
              
              {/* Physical India Map */}
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2F53cc67aca27645c2a236e9cbd125da04?format=webp&width=800"
                  alt="Physical Map of India"
                  className="w-full h-auto rounded-lg shadow-lg"
                />

                {/* Clickable State Overlays */}
                {/* Rajasthan */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 hover:bg-amber-400/20 rounded-lg"
                  style={{
                    top: '32%',
                    left: '18%',
                    width: '20%',
                    height: '18%',
                    backgroundColor: selectedState === "rajasthan" ? 'rgba(205, 133, 63, 0.3)' : 'transparent'
                  }}
                  onClick={() => setSelectedState("rajasthan")}
                  onMouseEnter={() => setHoveredState("rajasthan")}
                  onMouseLeave={() => setHoveredState(null)}
                  title="Rajasthan - Blue Pottery"
                />

                {/* Uttar Pradesh */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 hover:bg-orange-400/20 rounded-lg"
                  style={{
                    top: '26%',
                    left: '42%',
                    width: '18%',
                    height: '12%',
                    backgroundColor: selectedState === "uttar-pradesh" ? 'rgba(255, 153, 51, 0.3)' : 'transparent'
                  }}
                  onClick={() => setSelectedState("uttar-pradesh")}
                  onMouseEnter={() => setHoveredState("uttar-pradesh")}
                  onMouseLeave={() => setHoveredState(null)}
                  title="Uttar Pradesh - Banarasi Silk"
                />

                {/* Bihar */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 hover:bg-indigo-400/20 rounded-lg"
                  style={{
                    top: '38%',
                    left: '60%',
                    width: '12%',
                    height: '8%',
                    backgroundColor: selectedState === "bihar" ? 'rgba(75, 0, 130, 0.3)' : 'transparent'
                  }}
                  onClick={() => setSelectedState("bihar")}
                  onMouseEnter={() => setHoveredState("bihar")}
                  onMouseLeave={() => setHoveredState(null)}
                  title="Bihar - Madhubani Paintings"
                />

                {/* West Bengal */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 hover:bg-amber-400/20 rounded-lg"
                  style={{
                    top: '44%',
                    left: '72%',
                    width: '10%',
                    height: '12%',
                    backgroundColor: selectedState === "west-bengal" ? 'rgba(205, 133, 63, 0.3)' : 'transparent'
                  }}
                  onClick={() => setSelectedState("west-bengal")}
                  onMouseEnter={() => setHoveredState("west-bengal")}
                  onMouseLeave={() => setHoveredState(null)}
                  title="West Bengal - Kantha Embroidery"
                />

                {/* Andhra Pradesh */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 hover:bg-orange-400/20 rounded-lg"
                  style={{
                    top: '65%',
                    left: '48%',
                    width: '14%',
                    height: '12%',
                    backgroundColor: selectedState === "andhra-pradesh" ? 'rgba(255, 153, 51, 0.3)' : 'transparent'
                  }}
                  onClick={() => setSelectedState("andhra-pradesh")}
                  onMouseEnter={() => setHoveredState("andhra-pradesh")}
                  onMouseLeave={() => setHoveredState(null)}
                  title="Andhra Pradesh - Kalamkari Art"
                />

                {/* Odisha */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 hover:bg-indigo-400/20 rounded-lg"
                  style={{
                    top: '58%',
                    left: '62%',
                    width: '10%',
                    height: '10%',
                    backgroundColor: selectedState === "odisha" ? 'rgba(75, 0, 130, 0.3)' : 'transparent'
                  }}
                  onClick={() => setSelectedState("odisha")}
                  onMouseEnter={() => setHoveredState("odisha")}
                  onMouseLeave={() => setHoveredState(null)}
                  title="Odisha - Pattachitra Paintings"
                />

                {/* Kerala */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 hover:bg-orange-400/20 rounded-lg"
                  style={{
                    top: '82%',
                    left: '38%',
                    width: '8%',
                    height: '12%',
                    backgroundColor: selectedState === "kerala" ? 'rgba(255, 153, 51, 0.3)' : 'transparent'
                  }}
                  onClick={() => setSelectedState("kerala")}
                  onMouseEnter={() => setHoveredState("kerala")}
                  onMouseLeave={() => setHoveredState(null)}
                  title="Kerala - Coir Products"
                />

                {/* Enhanced Hover Tooltip */}
                {hoveredState && stateCrafts[hoveredState as keyof typeof stateCrafts] && (
                  <div
                    className="absolute top-4 right-4 bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-2xl border border-orange-200 max-w-xs backdrop-blur-sm z-10 transform transition-all duration-300 scale-105"
                    style={{
                      borderLeft: `4px solid ${stateCrafts[hoveredState as keyof typeof stateCrafts].color}`,
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md"
                        style={{ backgroundColor: `${stateCrafts[hoveredState as keyof typeof stateCrafts].color}20` }}
                      >
                        <span>{stateCrafts[hoveredState as keyof typeof stateCrafts].icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-bold text-gray-800 text-base leading-tight mb-1"
                          style={{
                            fontFamily: 'Rajdhani, sans-serif',
                            color: stateCrafts[hoveredState as keyof typeof stateCrafts].color
                          }}
                        >
                          {stateCrafts[hoveredState as keyof typeof stateCrafts].craft}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {stateCrafts[hoveredState as keyof typeof stateCrafts].name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Click to explore craft
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <div className="w-1 h-1 rounded-full bg-orange-300"></div>
                        <div className="w-1 h-1 rounded-full bg-orange-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Craft Details Panel */}
          {selectedCraft && (
            <div className="lg:col-span-1">
              <div
                className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-2xl overflow-hidden border border-orange-200 sticky top-8 transform transition-all duration-500 hover:shadow-3xl"
                style={{
                  borderTop: `4px solid ${selectedCraft.color}`,
                  animation: 'fadeInUp 0.6s ease-out'
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={selectedCraft.image}
                    alt={selectedCraft.craft}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className="text-white border-white/50"
                      style={{ backgroundColor: selectedCraft.color }}
                    >
                      {selectedCraft.icon} {selectedCraft.craft}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{selectedCraft.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {selectedCraft.craft}
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedCraft.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Meet the Artisan
                    </h4>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <h5 className="font-medium text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {selectedCraft.artisan}
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {selectedCraft.artisanStory}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Price Range
                    </h4>
                    <p className="text-2xl font-bold" style={{ color: selectedCraft.color }}>
                      {selectedCraft.price}
                    </p>
                  </div>

                  <Button 
                    className="w-full text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: selectedCraft.color }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { InteractiveIndiaMap };
