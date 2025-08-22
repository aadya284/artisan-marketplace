import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { TwoColumnHeroWithImage } from "@/components/heros/two-column-hero-with-image";
import { TaglineSection } from "@/components/tagline/tagline-section";
import { SocialTeamProfiles } from "@/components/teams/social-team-profiles";
import { CompanyLogoTestimonials } from "@/components/testimonials/company-logo-testimonials";
import { GradientOverlayCta } from "@/components/cta/gradient-overlay-cta";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";

export default function HomePage() {
  return (
    <>
      <AnimatedIndicatorNavbar />
      <TwoColumnHeroWithImage />
      <SocialTeamProfiles />
      <TaglineSection />
      <CompanyLogoTestimonials />
      <GradientOverlayCta />
      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}
