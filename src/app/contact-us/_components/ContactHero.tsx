import HeroBanner from "@/components/HeroBanner";
import type { PageBanner } from "@/types";

export interface ContactHeroProps {
  heroData: PageBanner | null;
}

const DEFAULT_DATA: PageBanner = {
  title: "CONTACT US",
  subtitle: null,
  backgroundImage:
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1600&q=80&auto=format&fit=crop",
  leftBadge: "SALE OF 50%",
  rightBadge: "TRENDS FOR 2024",
};

/**
 * ContactHero Component
 * Displays hero banner for contact page
 */
export default function ContactHero({ heroData }: ContactHeroProps) {
  const heroBannerData = heroData || DEFAULT_DATA;

  return <HeroBanner banner={heroBannerData} showGradient />;
}
