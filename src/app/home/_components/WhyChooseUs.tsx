"use client";

import type { FeatureHighlight, Locale } from "@/types";
import { getLucideIconComponent } from "@/lib/lucideIconMap";
import { t } from "@/locales/i18n/getTranslation";

export interface WhyChooseUsProps {
  features: FeatureHighlight[];
  title?: string;
  subtitle?: string;
  lang: Locale;
}

export default function WhyChooseUs({ features, title, subtitle, lang }: WhyChooseUsProps) {
  if (features.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
            {title || t(lang, "why_choose_us_title")}
          </h2>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
            {subtitle || t(lang, "why_choose_us_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature) => {
            const Icon = getLucideIconComponent(feature.icon);

            return (
              <div
                key={feature.id}
                className="text-center group hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sunken flex items-center justify-center group-hover:bg-ink-900 transition-colors duration-300">
                  <Icon className="w-10 h-10 text-ink group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-muted text-sm md:text-base">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
