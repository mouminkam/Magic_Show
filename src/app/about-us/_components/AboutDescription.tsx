import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/Button";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import type { AboutDescriptionBlock } from "@/types";

export interface AboutDescriptionProps {
  data: AboutDescriptionBlock | null;
}

/**
 * About description — no hardcoded placeholder copy; returns null when empty.
 */
export default function AboutDescription({ data }: AboutDescriptionProps) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const title = data.title ? String(data.title).trim() : "";
  const description = data.description ? String(data.description).trim() : "";
  const rawImage = data.image ? String(data.image).trim() : "";
  const features: string[] = Array.isArray(data.features)
    ? data.features.map((f: string) => (typeof f === "string" ? f.trim() : f)).filter(Boolean)
    : [];
  const buttonText = data.buttonText ? String(data.buttonText).trim() : "";

  if (!title && !description && !rawImage && features.length === 0) {
    return null;
  }

  const resolvedImageSrc = rawImage ? resolveImageUrl(rawImage) : null;

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {resolvedImageSrc ? (
            <div className="relative lg:w-1/2">
              <div className="relative z-10">
                <Image
                  src={resolvedImageSrc}
                  alt={title || "About us"}
                  width={520}
                  height={450}
                  className="w-full h-auto object-cover aspect-[520/450] min-h-[200px] sm:min-h-[280px] md:min-h-[480px] lg:min-h-[380px] xl:min-h-[450px]"
                />
              </div>
              <div className="absolute border-4 border-line-strong z-0 w-full h-full lg:left-10 lg:-right-10 lg:top-10 lg:-bottom-10 max-lg:left-5 max-lg:right-0 max-lg:top-5 max-lg:bottom-0" />
            </div>
          ) : null}

          <div
            className={`lg:ml-20 max-lg:mt-10 max-lg:flex max-lg:flex-col max-lg:items-center ${
              resolvedImageSrc ? "lg:w-1/2" : "lg:w-full max-w-3xl mx-auto"
            }`}
          >
            {data.subtitle ? (
              <span className="text-lg font-normal text-muted uppercase tracking-widest block mb-4">
                {data.subtitle}
              </span>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-normal text-ink uppercase tracking-widest inline relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-2 after:w-full after:h-1 after:bg-ink-600">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="text-muted text-lg leading-8 my-8">{description}</p>
            ) : null}

            {features.length > 0 ? (
              <ul className="space-y-3 mb-10 pl-6 max-lg:self-start max-lg:ml-5">
                {features.map((item: string, index: number) => (
                  <li
                    key={index}
                    className="text-muted text-lg relative before:content-['•'] before:absolute before:-left-6 before:text-muted before:font-bold"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {buttonText ? (
              <Button
                variant="secondary"
                size="md"
                className="flex items-center gap-2 group"
              >
                {buttonText}
                <ArrowRight className="w-5 h-5 ml-2  transition-transform duration-300 group-hover:animate-[moveRight_0.6s_ease-in-out_infinite]" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
