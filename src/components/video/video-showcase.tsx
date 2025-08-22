"use client";

import { Badge } from "@/components/ui/badge";

export function VideoShowcase() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <pattern id="pattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10 10L15 5L10 0L5 5Z" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge 
            variant="secondary" 
            className="mb-4 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200 px-4 py-2 text-sm font-medium"
          >
            ✨ Cultural Heritage
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              From Every State,
            </span>
            <br />
            <span className="text-gray-800">For Every Heart</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the rich tapestry of Indian craftsmanship that connects hearts across the nation
          </p>
        </div>

        {/* Video Section */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/5 backdrop-blur-sm p-2">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              >
                <source
                  src="https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2F7fef6525e5c648239ca763daac2aa5b5?alt=media&token=36e154a8-b360-4308-8650-083fb01ffd71&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full opacity-80 animate-pulse-soft"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse-soft" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto">
            Experience the beauty and diversity of Indian artisanal traditions that have been passed down through generations
          </p>
        </div>
      </div>
    </section>
  );
}
