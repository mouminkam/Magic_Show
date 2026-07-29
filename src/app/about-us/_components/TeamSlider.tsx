"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageUrl, FALLBACK_IMAGE } from "@/lib/utils/imageUtils";
import { t } from "@/locales/i18n/getTranslation";
import type { Locale, TeamMember } from "@/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface TeamSliderProps {
  teamMembers?: TeamMember[];
  lang?: Locale;
}

export default function TeamSlider({ teamMembers = [], lang = "en" }: TeamSliderProps) {
  const list = Array.isArray(teamMembers) ? teamMembers : [];
  if (list.length === 0) {
    return null;
  }

  const kicker = t(lang, "about_team_kicker");
  const heading = t(lang, "about_team_heading");

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-2xl font-normal text-muted uppercase tracking-widest block mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-16 after:h-0.5 after:bg-ink-600">
            {kicker}
          </span>
          <h3 className="text-6xl font-light text-ink uppercase tracking-widest">
            {heading}
          </h3>
        </div>

        <div className="relative group/nav">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            slidesPerGroup={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={list.length > 1}
            navigation={{
              prevEl: ".team-swiper-button-prev",
              nextEl: ".team-swiper-button-next",
            }}
            pagination={{
              clickable: true,
              el: ".team-swiper-pagination",
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="team-swiper"
          >
            {list.map((member, index) => {
              const img = member.image || "";
              const src = img ? resolveImageUrl(img) : FALLBACK_IMAGE;

              return (
                <SwiperSlide key={member.id ?? index}>
                  <div className="flex flex-col items-center text-center h-[470px] max-w-[360px] mx-auto">
                    <div className="relative w-[360px] h-[470px] overflow-hidden rounded-lg bg-sunken">
                      <Image
                        src={src}
                        alt={member.name || "Team member"}
                        fill
                        sizes="360px"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-6">
                      <h4 className="text-xl font-semibold text-ink">
                        {member.name}
                      </h4>
                      {member.role ? (
                        <p className="text-muted mt-1">{member.role}</p>
                      ) : null}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            type="button"
            className="team-swiper-button-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-surface p-3 rounded-full shadow-[var(--shadow-lg)] border border-line hover:bg-sunken"
          >
            <ChevronLeft className="w-6 h-6 text-ink" />
          </button>
          <button
            type="button"
            className="team-swiper-button-next absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-surface p-3 rounded-full shadow-[var(--shadow-lg)] border border-line hover:bg-sunken"
          >
            <ChevronRight className="w-6 h-6 text-ink" />
          </button>

          <div className="team-swiper-pagination flex justify-center gap-2 mt-8" />
        </div>
      </div>
    </section>
  );
}
