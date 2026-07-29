import type { Metadata } from "next";
import HomePage from "./home/page";

export const metadata: Metadata = {
  title: "Magic Show — Footwear & Leather Goods",
  description:
    "Heels, boots, sandals, sneakers, bags and jewelry lasted by hand in Damascus. Free shipping over $150 and 30-day returns.",
  keywords: ["shoes", "heels", "boots", "sandals", "sneakers", "bags", "jewelry"],
  openGraph: {
    title: "Magic Show — Footwear & Leather Goods",
    description: "Built to be resoled, not replaced.",
    type: "website",
    locale: "ar_SY",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Magic Show — Footwear & Leather Goods",
    description: "Built to be resoled, not replaced.",
  },
};

export default function Page() {
  return <HomePage />;
}
