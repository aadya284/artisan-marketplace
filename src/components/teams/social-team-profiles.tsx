import { Eye, Palette, Scissors } from "lucide-react";

import { Badge } from "@/components/ui/badge";

// Featured Indian artisans with their craft specialties
const artisans = [
  {
    name: "Rajesh Kumar",
    role: "Master Potter from Rajasthan",
    image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Rajesh%20Kumar",
    bio: "Rajesh carries forward 300 years of family tradition in blue pottery, creating stunning pieces using the ancient Persian technique brought to Jaipur centuries ago.",
    productLink: "#pottery-collection",
  },
  {
    name: "Meera Devi",
    role: "Textile Weaver from Gujarat",
    image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Meera%20Devi",
    bio: "Meera specializes in traditional Patola silk weaving, a complex double ikat technique that takes months to complete a single saree with geometric patterns.",
    productLink: "#textile-collection",
  },
  {
    name: "Arjun Singh",
    role: "Wood Carver from Kashmir",
    image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Arjun%20Singh",
    bio: "Arjun creates intricate walnut wood carvings using traditional Kashmiri techniques, specializing in floral motifs and geometric patterns passed down through generations.",
    productLink: "#woodwork-collection",
  },
  {
    name: "Lakshmi Nair",
    role: "Metal Craft Artist from Kerala",
    image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Lakshmi%20Nair",
    bio: "Lakshmi masters the ancient art of bronze casting and bell metal work, creating traditional lamps, vessels, and decorative pieces using age-old Kerala techniques.",
    productLink: "#metalwork-collection",
  },
];

const SocialTeamProfiles = () => {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6 py-4 lg:py-8">
          <Badge
            variant="outline"
            className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <Palette className="size-4" />
            <span>Meet Our Artisans</span>
          </Badge>
          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl font-display">
            Masters of Traditional Crafts
          </h2>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground">
            Discover the talented artisans who preserve India's rich cultural heritage through their exceptional craftsmanship and time-honored techniques.
          </p>
        </div>
        <div className="mt-10 grid gap-x-12 gap-y-16 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {artisans.map((artisan) => (
            <div key={artisan.name} className="group flex flex-col">
              <img
                src={artisan.image}
                alt={artisan.name}
                width={80}
                height={80}
                className="rounded-full object-contain"
              />
              <div className="mt-6 flex flex-col tracking-[-0.32px]">
                <h3 className="text-lg font-display">{artisan.name}</h3>
                <p className="text-muted-foreground-subtle">{artisan.role}</p>
                <p className="mt-4 text-sm tracking-[-0.36px] text-muted-foreground">
                  {artisan.bio}
                </p>
                <div className="mt-6 flex gap-2">
                  <a
                    href={artisan.productLink}
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                  >
                    <Eye className="size-4" />
                    View Products
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { SocialTeamProfiles };