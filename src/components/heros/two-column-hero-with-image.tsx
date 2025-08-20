"use client";

import { ArrowRight, ArrowUpRight, Palette } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TwoColumnHeroWithImage = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Video Background */}
      <video
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f6573a0d-fab5-4352-8cd3-cbb57cb60cb9/generated_videos/close-up-cinematic-shot-of-skilled-india-5420c79a-20250820084136.mp4?"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-20" />

      <div className="container mx-auto relative z-30">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="bg-primary text-primary-foreground border-0 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Palette className="mr-2 size-3.5 text-primary-foreground" />
            Handcrafted Heritage
            <ArrowUpRight className="ml-2 size-4" />
          </Badge>

          <h1 className="text-pretty text-4xl font-bold lg:text-6xl xl:text-7xl leading-tight font-display text-white">
            Where Every Craft Tells a Story and{" "}
            <span className="text-primary font-bold">
              Local Hands Meet Global Arts
            </span>
          </h1>

          <p className="text-white/90 max-w-xl lg:text-xl leading-relaxed">
            Discover authentic handcrafted products from local Indian artisans. Every purchase supports traditional craftsmanship and helps preserve cultural heritage.
          </p>

          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto group bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full px-8"
            >
              Explore Marketplace
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto group bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Learn About Artisans
              <ArrowUpRight className="ml-2 size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { TwoColumnHeroWithImage };