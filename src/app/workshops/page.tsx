"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Video, Users, Loader } from "lucide-react";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // widened default

  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  // ✅ Fetch from Firestore
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        console.log("🔹 Fetching workshops from Firestore...");
        
        // Get all workshops without ordering first
        const workshopsRef = collection(db, "workshops");
        
        // Log the collection reference
        console.log("📁 Collection reference:", workshopsRef.path);
        
        // Get the documents
        const querySnapshot = await getDocs(workshopsRef);
        
        // Log detailed information about the snapshot
        console.log("� Query snapshot details:", {
          size: querySnapshot.size,
          empty: querySnapshot.empty,
          metadata: querySnapshot.metadata
        });
        
        // Log each document's ID and data
        querySnapshot.forEach((doc) => {
          console.log(`📄 Document ${doc.id}:`, {
            exists: doc.exists(),
            data: doc.data()
          });
        });

        if (querySnapshot.empty) {
          console.warn("⚠️ No workshop documents found in Firestore.");
          return;
        }

        const fetched = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(`🔍 Processing workshop ${doc.id}:`, data);
          
          // Log any missing required fields
          const requiredFields = ['title', 'artisan', 'blurb', 'price', 'level', 'duration', 'poster'];
          const missingFields = requiredFields.filter(field => !data[field]);
          if (missingFields.length > 0) {
            console.warn(`⚠️ Workshop ${doc.id} is missing fields:`, missingFields);
          }
          
          // Ensure all required fields are present
          const workshop = {
            id: doc.id,
            title: data.title || "Untitled Workshop",
            artisan: data.artisan || "Unknown Artisan",
            blurb: data.blurb || "Workshop description coming soon...",
            price: typeof data.price === 'number' ? data.price : 0,
            level: data.level || "All Levels",
            duration: data.duration || "1 hour",
            poster: data.poster || "/placeholder-workshop.jpg",
            video: data.video || null,
            ...data
          };
          
          console.log(`✅ Processed workshop ${doc.id}:`, workshop);
          return workshop;
        });

        console.log("📊 Total workshops fetched:", fetched.length);
        console.log("� All workshop IDs:", fetched.map(w => w.id));
        setWorkshops(fetched);
      } catch (error) {
        console.error("❌ Error fetching workshops:", error);
        // Check for specific Firestore errors
        if (error instanceof Error) {
          console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          
          if (error.message.includes("permission-denied")) {
            console.error("🔒 Permission denied. Please check Firestore rules.");
          } else if (error.message.includes("not-found")) {
            console.error("📁 Collection not found. Please check collection name.");
          } else if (error.message.includes("offline")) {
            console.error("📡 Unable to connect to Firestore. Check your internet connection.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);


  // 🔍 Filter logic (case-insensitive + level fix)
  const filtered = workshops.filter((w) => {
    const title = w.title?.toLowerCase() || "";
    const artisan = w.artisan?.toLowerCase() || "";
    const levelValue = w.level?.toLowerCase() || "";

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      artisan.includes(searchQuery.toLowerCase());

    const matchesLevel =
      level === "All" ||
      levelValue === level.toLowerCase() ||
      (level === "All Levels" && w.level === "All Levels");

    const matchesPrice =
      typeof w.price === "number" &&
      w.price >= priceRange[0] &&
      w.price <= priceRange[1];

    return matchesSearch && matchesLevel && matchesPrice;
  });

  return (
    <>
      <AnimatedIndicatorNavbar />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-r from-orange-100 to-amber-100">
          <div className="container mx-auto text-center">
            <h1
              className="text-4xl lg:text-6xl font-bold mb-4 text-gray-800"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              KarigarSetu
              <span className="block text-orange-600">Workshops</span>
            </h1>
            <p
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
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
                    className={
                      level === lv
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "border-orange-200 text-orange-700 hover:bg-orange-50"
                    }
                  >
                    {lv}
                  </Button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <div className="min-w-[220px] w-full lg:w-64">
                  <Slider
                    min={0}
                    max={5000}
                    value={priceRange}
                    onValueChange={(v: any) => setPriceRange(v)}
                  />
                </div>
                <Badge variant="outline" className="text-primary border-orange-200">
                  ₹{priceRange[0]}–₹{priceRange[1]}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <Loader className="w-6 h-6 animate-spin mx-auto mb-3" />
                <p className="text-gray-500">Loading workshops...</p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <h2
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Rajdhani, sans-serif" }}
                  >
                    {filtered.length} Workshops Available
                  </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((w) => (
                    <div
                      key={w.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="relative">
                        {w.video ? (
                          <video
                            className="w-full h-48 object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="none"
                            poster={w.poster}
                          >
                            <source src={w.video} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={w.poster}
                            alt={w.title}
                            className="w-full h-48 object-cover"
                          />
                        )}

                        <Badge className="absolute top-3 left-3 bg-red-600 text-white">Live</Badge>
                        <Badge
                          variant="outline"
                          className="absolute top-3 right-3 text-xs text-orange-700 border-orange-200"
                        >
                          {w.level}
                        </Badge>

                        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Users className="w-3 h-3" /> 50+ joined
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs text-orange-700 border-orange-200 mb-2"
                          >
                            {w.duration}
                          </Badge>
                          <h3
                            className="font-bold text-xl text-gray-800 mb-2 leading-tight"
                            style={{ fontFamily: "Rajdhani, sans-serif" }}
                          >
                            {w.title}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-1"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            by {w.artisan}
                          </p>
                        </div>

                        <p
                          className="text-sm text-gray-700 mb-4 leading-relaxed"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {w.blurb}
                        </p>

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
              </>
            )}
          </div>
        </section>
      </div>

      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}
