"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeHero } from "@/types";
import { resolveImageUrl } from "@/lib/utils/imageUtils";

export interface HomeBannerProps {
  hero: HomeHero;
}

/** Home page hero: headline, two CTAs, stat row and a circular product shot. */
export default function HomeBanner({ hero }: HomeBannerProps) {
  const heroImage = resolveImageUrl(hero.heroImage);

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] bg-surface overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--c-ink) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-48 h-48 md:w-64 md:h-64 border-2 border-line rounded-full opacity-50 transition-transform duration-300" />
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-32 h-32 md:w-48 md:h-48 border-2 border-line rounded-full opacity-50 transition-transform duration-300" />
      </div>

      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 py-12 md:py-16 lg:py-20 gap-8 lg:gap-12">
        <div className="flex-1 max-w-2xl w-full">
          <div className="inline-block eyebrow mb-4 md:mb-6 px-4 py-2 border border-line-strong rounded-full hover:border-brand hover:text-brand transition-colors">
            {hero.badge}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 md:mb-6 leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-ink via-ink-800 to-ink bg-clip-text text-transparent">
              {hero.title}
            </span>
            {hero.subtitle && (
              <>
                <br />
                <span className="font-light bg-gradient-to-r from-rust-400 via-brand to-rust-600 bg-clip-text text-transparent">
                  {hero.subtitle}
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted mb-8 sm:mb-10 md:mb-12 max-w-xl leading-relaxed">
            {hero.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-8 sm:mb-10 md:mb-12">
            <Link
              href={hero.ctaPrimaryLink}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-brand border-2 border-brand font-semibold rounded-md overflow-hidden transition-all shadow-[var(--shadow-lg)] focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
            >
              <span className="relative z-10 transition-colors duration-300 text-brand-fg group-hover:text-brand">
                {hero.ctaPrimary}
              </span>
              <span className="absolute inset-0 bg-surface transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            {hero.ctaSecondary && (
              <Link
                href={hero.ctaSecondaryLink}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-ink font-semibold rounded-md overflow-hidden transition-all shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
              >
                <span className="relative z-10 transition-colors duration-300 text-ink group-hover:text-canvas">
                  {hero.ctaSecondary}
                </span>
                <span className="absolute inset-0 bg-ink transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            )}
          </div>

          {hero.stats.length > 0 && (
            <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-10 text-muted">
              {hero.stats.map((stat) => (
                <div key={stat.label} className="relative group cursor-default">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-ink mb-1 tnum transition-all duration-300 group-hover:text-brand group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="eyebrow">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 relative w-full max-w-md xl:max-w-lg">
          <div className="relative mx-auto">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-96 xl:h-96 rounded-full overflow-hidden border-4 border-line shadow-[var(--shadow-lg)] transition-all duration-500 hover:scale-105 hover:border-rust-200 mx-auto">
              <Image
                src={heroImage}
                alt={`${hero.title} ${hero.subtitle}`.trim()}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, (max-width: 1280px) 352px, 384px"
              />
            </div>

            <div className="absolute -top-4 -right-4 w-16 h-16 xl:w-24 xl:h-24 bg-gradient-to-br from-rust-400 to-rust-600 rounded-full border-4 border-surface shadow-[var(--shadow-md)] opacity-90 animate-pulse" />
            <div
              className="absolute -bottom-4 -left-4 w-20 h-20 xl:w-32 xl:h-32 bg-gradient-to-br from-ink-600 to-ink-900 rounded-full border-4 border-surface shadow-[var(--shadow-md)] opacity-70 animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            <div className="absolute top-1/4 -left-8 w-3 h-3 bg-brand rounded-full opacity-60" />
            <div className="absolute bottom-1/3 -right-6 w-2 h-2 bg-ink-200 rounded-full opacity-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
