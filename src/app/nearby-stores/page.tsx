"use client";

import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Store, 
  Clock, 
  Search,
  Navigation,
  Heart,
  Star,
  Calendar
} from "lucide-react";

export default function NearbyStoresPage() {
  return (
    <>
      <AnimatedIndicatorNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto text-center">
            <Badge variant="outline" className="mb-6 bg-orange-100 text-orange-700 border-orange-200">
              <Clock className="w-4 h-4 mr-2" />
              Coming Soon
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Nearby Stores
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Discover authentic handcrafted treasures in your neighborhood. Find local artisan stores and experience traditional crafts in person.
            </p>

            <div className="flex justify-center">
              <div className="relative">
                <MapPin className="w-16 h-16 text-orange-600 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-600 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              What's Coming
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Interactive Map */}
              <Card className="border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Navigation className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Interactive Map
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Browse stores on an interactive Google Maps interface. Get real-time directions and see store locations near you.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Store Finder */}
              <Card className="border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Search className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Smart Search
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Search by craft type, artisan name, or distance. Filter results to find exactly what you're looking for nearby.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Store Details */}
              <Card className="border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Store className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Store Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    View store hours, contact information, featured artworks, and read reviews from other customers.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Wishlist Integration */}
              <Card className="border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Heart className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Wishlist Sync
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    See which of your wishlisted items are available in nearby stores for hands-on viewing before purchase.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Reviews & Ratings */}
              <Card className="border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Reviews & Ratings
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Read authentic reviews from customers and rate your in-store experience to help the community.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Event Calendar */}
              <Card className="border-orange-200 hover:border-orange-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Events & Workshops
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Discover local workshops, artisan demonstrations, and cultural events happening near you.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Be the First to Know
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Get notified when the Nearby Stores feature launches. Join our community of craft enthusiasts today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/80 focus:ring-2 focus:ring-white/50 focus:outline-none focus:bg-white/30"
              />
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8">
                Notify Me
              </Button>
            </div>

            <p className="text-sm text-white opacity-90 mt-4">
              We'll only send you updates about this feature. No spam, ever.
            </p>
          </div>
        </section>

        {/* Current Alternative */}
        <section className="py-16 bg-white">
          <div className="container mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              In the Meantime
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our online marketplace and discover thousands of authentic handcrafted items from talented artisans across India.
            </p>
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <a href="/explore">
                Explore Online Marketplace
              </a>
            </Button>
          </div>
        </section>
      </div>

      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}
