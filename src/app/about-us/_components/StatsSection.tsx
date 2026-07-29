"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { getLucideIconComponent } from "@/lib/lucideIconMap";
import type { AboutStat } from "@/types";

export interface StatsSectionProps {
  stats?: AboutStat[];
}

/**
 * StatsSection — About page statistics (icon names from API = Lucide PascalCase).
 */
export default function StatsSection({ stats = [] }: StatsSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const list = Array.isArray(stats) ? stats : [];

  if (list.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-sunken mt-5 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 text-center">
          {list.map((stat, index) => {
            const Icon = getLucideIconComponent(stat.icon);
            const raw = stat.value;
            const num =
              typeof raw === "number"
                ? raw
                : parseFloat(String(raw).replace(/,/g, ""));
            const endVal = Number.isFinite(num) ? num : 0;
            const decimals =
              endVal % 1 !== 0
                ? Math.min(3, (String(endVal).split(".")[1] || "").length)
                : 0;

            return (
              <div
                key={stat.id ?? index}
                className="group hover:transform hover:scale-105 transition-transform duration-300 min-w-0"
              >
                <Icon className="w-12 h-12 text-ink mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-normal text-ink uppercase tracking-widest mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-brand">
                  {stat.title}
                </h3>
                <span className="text-4xl md:text-4xl lg:text-6xl font-bold text-ink block">
                  {inView ? (
                    <CountUp
                      start={0}
                      end={endVal}
                      decimals={decimals}
                      duration={2}
                      suffix={stat.suffix ?? ""}
                    />
                  ) : (
                    `0${stat.suffix ?? ""}`
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
