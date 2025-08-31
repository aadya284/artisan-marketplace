import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const workshops = [
  {
    title: "Handloom Weaving Basics",
    artisan: "Sarla Devi",
    level: "Beginner",
    price: "₹499",
    duration: "60 min",
    video:
      "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    poster:
      "https://images.unsplash.com/photo-1611955167811-4711904bb9b8?q=80&w=1920&auto=format&fit=crop",
    blurb:
      "Learn the foundations of handloom weaving, from setting the warp to basic weft patterns you can practice at home.",
  },
  {
    title: "Terracotta Pottery 101",
    artisan: "Ramesh Kumar",
    level: "Beginner",
    price: "₹799",
    duration: "90 min",
    video:
      "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    poster:
      "https://images.unsplash.com/photo-1518131678677-a9e0c2d4a8c1?q=80&w=1920&auto=format&fit=crop",
    blurb:
      "Shape, carve, and fire your first terracotta piece under the guidance of an experienced artisan potter.",
  },
  {
    title: "Warli Painting Masterclass",
    artisan: "Meera Patil",
    level: "Intermediate",
    price: "₹999",
    duration: "120 min",
    video:
      "https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2Fe86a8089deb84d51bc4eece9e992bbc0?alt=media&token=e0941836-4c77-4002-ad9b-f8e4acd786a5&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5",
    poster:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1920&auto=format&fit=crop",
    blurb:
      "Discover motifs, storytelling, and composition to create your own Warli artwork from scratch.",
  },
];

export function LiveArtisanWorkshops() {
  return (
    <section id="workshops-section" className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-amber-50 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-orange-400" />
            <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full animate-pulse-soft" />
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Workshops</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Live video workshops led by artisans. Learn craft skills and support creators with paid sessions for sustainable income beyond product sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((w) => (
            <Card key={w.title} className="overflow-hidden">
              <div className="relative">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                  <span className="rounded-full bg-red-500/90 text-white text-xs px-2 py-0.5">Live</span>
                  <span className="rounded-full bg-black/70 text-white text-xs px-2 py-0.5">{w.level}</span>
                </div>
                <video
                  className="w-full h-56 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={w.poster}
                >
                  <source src={w.video} type="video/mp4" />
                </video>
              </div>

              <CardHeader className="pb-0">
                <CardTitle className="text-xl">{w.title}</CardTitle>
                <CardDescription>
                  By {w.artisan} • {w.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-muted-foreground">{w.blurb}</p>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">{w.price}</span>
                  <span className="text-xs text-muted-foreground">per seat</span>
                </div>
                <Button asChild size="sm">
                  <Link href="/register">Join Workshop</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
    </section>
  );
}
