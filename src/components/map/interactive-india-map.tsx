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
    icon: "🕌",
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
    artisanStory: "From the Pink City of Jaipur, Kripal Singh continues the 300-year-old tradition of blue pottery. His workshops blend Persian techniques with Rajasthani artistry.",
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
    icon: "🖼️",
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
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FF9933' fill-opacity='0.1'%3E%3Cpath d='m0 40 40-40H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
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
              
              {/* Simplified SVG Map */}
              <div className="relative">
                <svg viewBox="0 0 800 600" className="w-full h-auto">
                  {/* Rajasthan */}
                  <path
                    d="M100 150 L250 150 L250 280 L100 280 Z"
                    fill={selectedState === "rajasthan" ? "#CD853F" : hoveredState === "rajasthan" ? "#DEB887" : "#F5E6D3"}
                    stroke="#CD853F"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedState("rajasthan")}
                    onMouseEnter={() => setHoveredState("rajasthan")}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="175" y="220" textAnchor="middle" className="text-sm font-medium fill-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Rajasthan
                  </text>

                  {/* Uttar Pradesh */}
                  <path
                    d="M250 150 L450 150 L450 250 L250 250 Z"
                    fill={selectedState === "uttar-pradesh" ? "#FF9933" : hoveredState === "uttar-pradesh" ? "#FFB366" : "#FFF0E6"}
                    stroke="#FF9933"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedState("uttar-pradesh")}
                    onMouseEnter={() => setHoveredState("uttar-pradesh")}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="350" y="205" textAnchor="middle" className="text-sm font-medium fill-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Uttar Pradesh
                  </text>

                  {/* Bihar */}
                  <path
                    d="M450 150 L550 150 L550 220 L450 220 Z"
                    fill={selectedState === "bihar" ? "#4B0082" : hoveredState === "bihar" ? "#663399" : "#E6E0FF"}
                    stroke="#4B0082"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedState("bihar")}
                    onMouseEnter={() => setHoveredState("bihar")}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="500" y="190" textAnchor="middle" className="text-sm font-medium fill-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Bihar
                  </text>

                  {/* West Bengal */}
                  <path
                    d="M550 150 L650 150 L650 250 L550 250 Z"
                    fill={selectedState === "west-bengal" ? "#CD853F" : hoveredState === "west-bengal" ? "#DEB887" : "#F5E6D3"}
                    stroke="#CD853F"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedState("west-bengal")}
                    onMouseEnter={() => setHoveredState("west-bengal")}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="600" y="205" textAnchor="middle" className="text-sm font-medium fill-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    West Bengal
                  </text>

                  {/* Andhra Pradesh */}
                  <path
                    d="M300 350 L450 350 L450 450 L300 450 Z"
                    fill={selectedState === "andhra-pradesh" ? "#FF9933" : hoveredState === "andhra-pradesh" ? "#FFB366" : "#FFF0E6"}
                    stroke="#FF9933"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedState("andhra-pradesh")}
                    onMouseEnter={() => setHoveredState("andhra-pradesh")}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="375" y="405" textAnchor="middle" className="text-sm font-medium fill-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Andhra Pradesh
                  </text>

                  {/* Odisha */}
                  <path
                    d="M450 280 L550 280 L550 380 L450 380 Z"
                    fill={selectedState === "odisha" ? "#4B0082" : hoveredState === "odisha" ? "#663399" : "#E6E0FF"}
                    stroke="#4B0082"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedState("odisha")}
                    onMouseEnter={() => setHoveredState("odisha")}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="500" y="335" textAnchor="middle" className="text-sm font-medium fill-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Odisha
                  </text>

                  {/* Kerala */}
                  <path
                    d="M150 450 L250 450 L250 550 L150 550 Z"
                    fill={selectedState === "kerala" ? "#FF9933" : hoveredState === "kerala" ? "#FFB366" : "#FFF0E6"}
                    stroke="#FF9933"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedState("kerala")}
                    onMouseEnter={() => setHoveredState("kerala")}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="200" y="505" textAnchor="middle" className="text-sm font-medium fill-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Kerala
                  </text>
                </svg>

                {/* Hover Tooltip */}
                {hoveredState && stateCrafts[hoveredState as keyof typeof stateCrafts] && (
                  <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{stateCrafts[hoveredState as keyof typeof stateCrafts].icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                          {stateCrafts[hoveredState as keyof typeof stateCrafts].craft}
                        </h4>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {stateCrafts[hoveredState as keyof typeof stateCrafts].name}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Click to explore this craft
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Craft Details Panel */}
          {selectedCraft && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100 sticky top-8">
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
