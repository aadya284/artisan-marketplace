"use client";

import { Badge } from "@/components/ui/badge";

export function VideoShowcase() {
  return (
    <section className="relative min-h-screen py-32 lg:py-40 overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source
          src="https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2F7fef6525e5c648239ca763daac2aa5b5?alt=media&token=36e154a8-b360-4308-8650-083fb01ffd71&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-amber-900/30 z-20"></div>

      {/* Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-center w-full">
          <Badge
            variant="secondary"
            className="mb-6 bg-white/10 text-white border-white/20 px-6 py-3 text-base font-medium backdrop-blur-sm"
          >
            ✨ Cultural Heritage
          </Badge>

          <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
              From Every State,
            </span>
            <br />
            <span className="text-white">For Every Heart</span>
          </h2>

          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12">
            Discover the rich tapestry of Indian craftsmanship that connects hearts across the nation.
            Experience the beauty and diversity of artisanal traditions passed down through generations.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Explore Our Collection
            </button>
            <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              Meet Our Artisans
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-gradient-to-br from-orange-400/60 to-amber-400/60 rounded-full animate-pulse-soft z-20"></div>
      <div className="absolute bottom-20 right-10 w-8 h-8 bg-gradient-to-br from-amber-400/60 to-orange-400/60 rounded-full animate-pulse-soft z-20" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-20 w-6 h-6 bg-gradient-to-br from-orange-300/40 to-amber-300/40 rounded-full animate-pulse-soft z-20" style={{ animationDelay: "2s" }}></div>
    </section>
  );
}
