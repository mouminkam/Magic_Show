import type { ApiResponse } from "@/types";
import type { AboutPageData } from "@/mocks";
import AboutUsSection from "./AboutUsSection";

export interface AboutUsStreamProps {
  aboutPagePromise: Promise<ApiResponse<AboutPageData>>;
  lang?: "en" | "ar";
}

export default async function AboutUsStream({
  aboutPagePromise,
  lang = "en",
}: AboutUsStreamProps) {
  const { data } = await aboutPagePromise;

  return (
    <AboutUsSection
      teamMembers={data.team}
      testimonials={data.testimonials}
      aboutDescription={data.description}
      stats={data.stats}
      aboutHero={data.hero}
      className="overflow-hidden"
      lang={lang}
    />
  );
}
