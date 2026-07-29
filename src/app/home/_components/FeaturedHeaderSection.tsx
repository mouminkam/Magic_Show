import Link from "next/link";
import { ArrowBigRight } from "lucide-react";
import type { SectionHeader } from "@/types";

export interface FeaturedHeaderSectionProps {
  header: SectionHeader;
}

/** Text block that occupies the first two cells of the featured-products grid. */
export default function FeaturedHeaderSection({ header }: FeaturedHeaderSectionProps) {
  return (
    <div className="flex flex-col gap-0 justify-start items-center text-center w-full col-span-1 md:col-span-2 lg:col-span-2">
      <h3 className="text-faint text-lg md:text-xl lg:text-2xl xl:text-3xl w-1/2 font-normal tracking-wide mb-4 md:mb-5 uppercase relative">
        {header.title}
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-[3px] bg-line-strong rounded-4xl" />
      </h3>

      {header.subtitle && (
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-[2.25rem] font-light text-brand tracking-wider mb-3 md:mb-4 mt-1">
          {header.subtitle}
        </h2>
      )}

      {header.description && (
        <p className="text-muted text-sm md:text-base font-normal leading-snug max-w-lg mb-6 md:mb-2">
          {header.description}
        </p>
      )}

      {header.buttonText && (
        <div className="mb-3">
          <Link
            href={header.buttonLink ?? "/shop"}
            className="inline-flex items-center gap-2 group mt-4 md:mt-5 border-2 border-ink rounded-full px-4 py-2 hover:scale-105 transition-all duration-300"
          >
            {header.buttonText}
            <ArrowBigRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
