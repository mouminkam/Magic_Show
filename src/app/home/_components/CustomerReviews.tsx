"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { HomeReviewCard, Locale } from "@/types";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import { t } from "@/locales/i18n/getTranslation";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface CustomerReviewsProps {
  reviews: HomeReviewCard[];
  lang: Locale;
}

const STAR_POSITIONS = [1, 2, 3, 4, 5];

export default function CustomerReviews({ reviews, lang }: CustomerReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
            {t(lang, "customer_reviews_title")}
          </h2>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
            {t(lang, "customer_reviews_subtitle")}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={reviews.length > 3}
            navigation={{
              prevEl: ".customer-reviews-swiper-button-prev",
              nextEl: ".customer-reviews-swiper-button-next",
            }}
            pagination={{ clickable: true, el: ".customer-reviews-swiper-pagination" }}
            className="customer-reviews-swiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-sunken rounded-lg p-6 md:p-8 h-full flex flex-col border border-line hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {STAR_POSITIONS.map((position) => (
                      <Star
                        key={position}
                        className={`w-5 h-5 ${
                          position <= review.rating
                            ? "text-caution fill-current"
                            : "text-ink-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-ink mb-6 flex-1 leading-relaxed">
                    &quot;{review.comment}&quot;
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-line">
                    {review.image ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={resolveImageUrl(review.image)}
                          alt={review.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div>
                      <h4 className="font-semibold text-ink">{review.name}</h4>
                      <p className="text-sm text-muted">{review.date}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous review"
            className="customer-reviews-swiper-button-prev absolute -left-4 sm:left-0 top-1/2 transform -translate-y-1/2 bg-surface p-3 rounded-full shadow-[var(--shadow-lg)] hover:bg-sunken transition-colors duration-300 z-10 border border-line"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <button
            type="button"
            aria-label="Next review"
            className="customer-reviews-swiper-button-next absolute -right-4 sm:right-0 top-1/2 transform -translate-y-1/2 bg-surface p-3 rounded-full shadow-[var(--shadow-lg)] hover:bg-sunken transition-colors duration-300 z-10 border border-line"
          >
            <ChevronRight className="w-5 h-5 text-ink" />
          </button>

          <div className="customer-reviews-swiper-pagination flex justify-center gap-2 mt-8" />
        </div>
      </div>
    </section>
  );
}
