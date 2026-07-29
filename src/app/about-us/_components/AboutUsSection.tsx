import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroBanner from "@/components/HeroBanner";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import type {
  AboutDescriptionBlock,
  AboutStat,
  Locale,
  PageBanner,
  TeamMember,
  Testimonial,
} from "@/types";

const AboutDescription = dynamic(() => import("./AboutDescription"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
  ssr: true,
});

const StatsSection = dynamic(() => import("./StatsSection"), {
  loading: () => <SectionSkeleton variant="default" height="h-64" />,
  ssr: true,
});

const TeamSlider = dynamic(() => import("./TeamSlider"), {
  loading: () => <SectionSkeleton variant="grid" cardCount={4} height="h-96" />,
  ssr: true,
});

const TestimonialSlider = dynamic(() => import("./TestimonialSlider"), {
  loading: () => <SectionSkeleton variant="default" height="h-96" />,
  ssr: true,
});

export interface AboutUsSectionProps {
  teamMembers?: TeamMember[];
  testimonials?: Testimonial[];
  aboutDescription?: AboutDescriptionBlock | null;
  stats?: AboutStat[];
  aboutHero?: PageBanner | null;
  className?: string;
  lang?: Locale;
}

export default function AboutUsSection({
  teamMembers = [],
  testimonials = [],
  aboutDescription = null,
  stats = [],
  aboutHero = null,
  className = "",
  lang = "en",
}: AboutUsSectionProps) {
  const statsList = Array.isArray(stats) ? stats : [];
  const teamList = Array.isArray(teamMembers) ? teamMembers : [];
  const testimonialList = Array.isArray(testimonials) ? testimonials : [];

  return (
    <div className={className}>
      <ErrorBoundary>
        <AnimatedSection>
          <HeroBanner banner={aboutHero} showGradient />
        </AnimatedSection>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <AnimatedSection>
            <AboutDescription data={aboutDescription} />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>

      {statsList.length > 0 ? (
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-64" />}>
            <AnimatedSection>
              <StatsSection stats={statsList} />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>
      ) : null}

      {teamList.length > 0 ? (
        <ErrorBoundary>
          <Suspense
            fallback={<SectionSkeleton variant="grid" cardCount={4} height="h-96" />}
          >
            <AnimatedSection>
              <TeamSlider teamMembers={teamList} lang={lang} />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>
      ) : null}

      {testimonialList.length > 0 ? (
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
            <AnimatedSection>
              <TestimonialSlider testimonials={testimonialList} lang={lang} />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </div>
  );
}
