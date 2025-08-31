'use client'

import { useState } from "react";
import Link from "next/link";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Video, Users } from "lucide-react";

const WORKSHOPS = [
  {
    id: "weaving-basics",
    title: "Handloom Weaving Basics",
    artisan: "Sarla Devi",
    level: "Beginner",
    price: 199,
    duration: "60 min",
    poster: "https://images.unsplash.com/photo-1611955167811-4711904bb9b8?q=80&w=1920&auto=format&fit=crop",
    video: "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    blurb: "Learn the foundations of handloom weaving, from setting the warp to basic weft patterns you can practice at home.",
  },
  {
    id: "terracotta-101",
    title: "Terracotta Pottery 101",
    artisan: "Ramesh Kumar",
    level: "Beginner",
    price: 299,
    duration: "75 min",
    poster: "https://images.unsplash.com/photo-1518131678677-a9e0c2d4a8c1?q=80&w=1920&auto=format&fit=crop",
    video: "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    blurb: "Shape, carve, and fire your first terracotta piece under the guidance of an experienced artisan potter.",
  },
  {
    id: "warli-masterclass",
    title: "Warli Painting Masterclass",
    artisan: "Meera Patil",
    level: "Intermediate",
    price: 450,
    duration: "90 min",
    poster: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1920&auto=format&fit=crop",
    video: "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    blurb: "Discover motifs, storytelling, and composition to create your own Warli artwork from scratch.",
  },
  {
    id: "block-printing",
    title: "Block Printing at Home",
    artisan: "Kavita Joshi",
    level: "Beginner",
    price: 149,
    duration: "45 min",
    poster: "https://images.unsplash.com/photo-1604882357860-1c8944a75151?q=80&w=1920&auto=format&fit=crop",
    video: "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    blurb: "Carve simple blocks and print repeat patterns on fabric with safe, home-friendly inks.",
  },
  {
    id: "cane-basketry",
    title: "Cane Basketry Essentials",
    artisan: "Bhola Nath",
    level: "All Levels",
    price: 350,
    duration: "80 min",
    poster: "https://images.unsplash.com/photo-1582395761748-980e5a8e5d0f?q=80&w=1920&auto=format&fit=crop",
    video: "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    blurb: "Weave durable, beautiful baskets while learning tips on materials and finishing.",
  },
  {
    id: "embroidery",
    title: "Embroidery Stitches Pack",
    artisan: "Farah Ali",
    level: "Beginner",
    price: 99,
    duration: "50 min",
    poster: "https://images.unsplash.com/photo-1580920461934-6fe512ceb2d6?q=80&w=1920&auto=format&fit=crop",
    video: "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    blurb: "Master 10 fundamental stitches to embellish garments and accessories.",
  },
];

export default function WorkshopsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);

  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  const filtered = WORKSHOPS.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = level === "All" || w.level === level || (level === "All Levels" && w.level === "All Levels");
    const matchesPrice = w.price >= priceRange[0] && w.price <= priceRange[1];
    return matchesSearch && matchesLevel && matchesPrice;
  });

  return (
    <>
      <AnimatedIndicatorNavbar />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-r from-orange-100 to-amber-100">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              KarigarSetu
              <span className="block text-orange-600">Workshops</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Crafting Together, Growing Together.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search workshops or artisans..."
                className="pl-10 pr-4 py-3 w-full rounded-full border-orange-200 focus:border-orange-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Level Filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">Level:</span>
                {levels.map((lv) => (
                  <Button
                    key={lv}
                    variant={level === lv ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLevel(lv)}
                    className={level === lv ? "bg-orange-600 hover:bg-orange-700" : "border-orange-200 text-orange-700 hover:bg-orange-50"}
                  >
                    {lv}
                  </Button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <div className="min-w-[220px] w-full lg:w-64">
                  <Slider min={50} max={500} value={priceRange} onValueChange={(v: any) => setPriceRange(v)} />
                </div>
                <Badge variant="outline" className="text-orange-700 border-orange-200">
                  ₹{priceRange[0]}–₹{priceRange[1]}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12">
          <div className="container mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {filtered.length} Workshops Available
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((w) => (
                <div key={w.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="relative">
                    <video className="w-full h-48 object-cover" autoPlay loop muted playsInline preload="none" poster={w.poster}>
                      <source src={w.video} type="video/mp4" />
                    </video>

                    <Badge className="absolute top-3 left-3 bg-red-600 text-white">Live</Badge>
                    <Badge variant="outline" className="absolute top-3 right-3 text-xs text-orange-700 border-orange-200">
                      {w.level}
                    </Badge>

                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Users className="w-3 h-3" /> 50+ joined
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs text-orange-700 border-orange-200 mb-2">{w.duration}</Badge>
                      <h3 className="font-bold text-xl text-gray-800 mb-2 leading-tight" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{w.title}</h3>
                      <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>by {w.artisan}</p>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>{w.blurb}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold">₹{w.price}</span>
                        <span className="text-xs text-gray-500">per seat</span>
                      </div>
                      <Button asChild className="bg-orange-600 hover:bg-orange-700">
                        <Link href={`/workshops/${w.id}`}>
                          <Video className="w-4 h-4 mr-2" /> Join Workshop
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Video className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No workshops found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
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
