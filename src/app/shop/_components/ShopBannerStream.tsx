import type { ApiResponse, PageBanner } from "@/types";
import HeroBanner from "@/components/HeroBanner";

export interface ShopBannerStreamProps {
  bannerPromise: Promise<ApiResponse<PageBanner>>;
}

/** Awaits the shop banner so the rest of the page can render before it lands. */
export default async function ShopBannerStream({ bannerPromise }: ShopBannerStreamProps) {
  const { data } = await bannerPromise;
  return <HeroBanner banner={data} showGradient />;
}
