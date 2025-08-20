import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { TwoColumnHeroWithImage } from "@/components/heros/two-column-hero-with-image";
import { HorizontalCarouselGallery } from "@/components/gallery/horizontal-carousel-gallery";
import { SocialTeamProfiles } from "@/components/teams/social-team-profiles";
import { ThreeColumnImageCards } from "@/components/feature/three-column-image-cards";
import { CompanyLogoTestimonials } from "@/components/testimonials/company-logo-testimonials";
import { GradientOverlayCta } from "@/components/cta/gradient-overlay-cta";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";

export default function HomePage() {
  return (
    <>
      <AnimatedIndicatorNavbar />
      <TwoColumnHeroWithImage />
      <HorizontalCarouselGallery />
      <ThreeColumnImageCards />
      <SocialTeamProfiles />
      <CompanyLogoTestimonials />
      <GradientOverlayCta />
      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}