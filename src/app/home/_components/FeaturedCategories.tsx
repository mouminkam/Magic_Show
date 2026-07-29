import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { FeaturedCategoryCard, Locale } from "@/types";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import { t } from "@/locales/i18n/getTranslation";

export interface FeaturedCategoriesProps {
  categories: FeaturedCategoryCard[];
  title?: string;
  subtitle?: string;
  lang: Locale;
}

export default function FeaturedCategories({
  categories,
  title,
  subtitle,
  lang,
}: FeaturedCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
            {title || t(lang, "shop_by_category")}
          </h2>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
            {subtitle || t(lang, "discover_collections")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group relative overflow-hidden rounded-lg aspect-square bg-sunken hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full h-full">
                <Image
                  src={resolveImageUrl(category.image)}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <h3 className="text-white text-lg md:text-xl font-bold mb-2 text-center uppercase tracking-wide">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium">{t(lang, "shop_now")}</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
