import { Button } from "@/components/ui/button";

const GradientOverlayCta = () => {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto">
        <div className="flex h-[620px] items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg')] bg-cover bg-center">
          <div className="flex flex-col gap-8 p-4 text-center">
            <h2 className="text-primary-foreground text-5xl font-bold font-display">
              Ready to Share Your Craft with the World?
            </h2>
            <p className="text-primary-foreground text-lg">
              Join thousands of artisans who have expanded their reach through our platform. Start selling your traditional crafts today.
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button size="lg" variant="default">
                Become an Artisan Partner
              </Button>
              <Button size="lg" variant="secondary">
                Learn More About Benefits
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};