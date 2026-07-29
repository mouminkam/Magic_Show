"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import { t } from "@/locales/i18n/getTranslation";
import type { Locale, Testimonial } from "@/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface TestimonialSliderProps {
  testimonials?: Testimonial[];
  lang?: Locale;
}

export default function TestimonialSlider({
  testimonials = [],
  lang = "en",
}: TestimonialSliderProps) {
  const raw = Array.isArray(testimonials) ? testimonials : [];
  const list = raw.filter((item) => {
    const name = item.customerName || "";
    const text = item.text || "";
    return String(name).trim() && String(text).trim();
  });

  if (list.length === 0) {
    return null;
  }

  const kicker = t(lang, "about_testimonials_kicker");
  const heading = t(lang, "about_testimonials_heading");

  return (
    <section className="py-20 bg-sunken">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-2xl font-normal text-muted uppercase tracking-widest block mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-16 after:h-0.5 after:bg-ink-600">
            {kicker}
          </span>
          <h3 className="text-6xl font-light text-ink uppercase tracking-widest">
            {heading}
          </h3>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={list.length > 1}
            navigation={{
              prevEl: ".testimonial-swiper-button-prev",
              nextEl: ".testimonial-swiper-button-next",
            }}
            pagination={{
              clickable: true,
              el: ".testimonial-swiper-pagination",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            className="testimonial-swiper"
          >
            {list.map((testimonial, index) => {
              const name = testimonial.customerName || "Customer";
              const text = testimonial.text || "";
              const rawImg = testimonial.customerImage;
              const hasImg = rawImg && String(rawImg).trim() !== "";
              const resolvedImageSrc = hasImg ? resolveImageUrl(rawImg) : null;

              return (
                <SwiperSlide key={testimonial.id ?? index}>
                  <div className="text-center group px-4">
                    {resolvedImageSrc ? (
                      <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-line-strong group-hover:border-line-strong transition-colors duration-300">
                        <Image
                          src={resolvedImageSrc}
                          alt={name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-32 h-32 mx-auto mb-8 rounded-full bg-ink-200 border-4 border-line-strong"
                        aria-hidden
                      />
                    )}

                    <h3 className="text-2xl font-bold text-ink uppercase tracking-widest mb-6">
                      {name}
                    </h3>

                    <div className="relative">
                      <p className="text-muted text-lg leading-8 italic max-w-2xl mx-auto relative">
                        <span className="text-6xl text-ink-200 absolute -top-4 -left-4">
                          &ldquo;
                        </span>
                        {text}
                        <span className="text-6xl text-ink-200 absolute -bottom-8 -right-4">
                          &rdquo;
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-center mt-6">
                      {[...Array(5)].map((_, starIndex) => (
                        <span
                          key={starIndex}
                          className={`text-2xl mx-1 ${
                            starIndex < (testimonial.rating || 5)
                              ? "text-caution"
                              : "text-ink-200"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            type="button"
            className="testimonial-swiper-button-prev absolute -left-4 sm:left-4 top-1/2 transform -translate-y-1/2 bg-surface p-3 rounded-full shadow-[var(--shadow-lg)] hover:bg-sunken transition-colors duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-ink" />
          </button>
          <button
            type="button"
            className="testimonial-swiper-button-next absolute -right-4 sm:right-4 top-1/2 transform -translate-y-1/2 bg-surface p-3 rounded-full shadow-[var(--shadow-lg)] hover:bg-sunken transition-colors duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6 text-ink" />
          </button>

          <div className="testimonial-swiper-pagination flex justify-center space-x-3 mt-8" />
        </div>
      </div>
    </section>
  );
}
