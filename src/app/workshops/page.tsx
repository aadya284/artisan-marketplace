import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Workshops</h1>
          <p className="mt-3 text-muted-foreground">Live artisan-led video workshops. Prices range from ₹50–₹500.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKSHOPS.map((w) => (
            <Card key={w.id} className="overflow-hidden">
              <div className="relative">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                  <span className="rounded-full bg-red-500/90 text-white text-xs px-2 py-0.5">Live</span>
                  <span className="rounded-full bg-black/70 text-white text-xs px-2 py-0.5">{w.level}</span>
                </div>
                <video
                  className="w-full h-48 object-cover"
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
                <CardTitle className="text-lg">{w.title}</CardTitle>
                <CardDescription>
                  By {w.artisan} • {w.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-muted-foreground">{w.blurb}</p>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold">₹{w.price}</span>
                  <span className="text-xs text-muted-foreground">per seat</span>
                </div>
                <Button asChild size="sm">
                  <Link href={`/workshops/${w.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
