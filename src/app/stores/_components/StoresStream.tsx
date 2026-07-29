import type { ApiResponse } from "@/types";
import type { StoresPageData } from "@/mocks";
import StoresSection from "./StoresSection";

export interface StoresStreamProps {
  storesPagePromise: Promise<ApiResponse<StoresPageData>>;
}

export default async function StoresStream({ storesPagePromise }: StoresStreamProps) {
  const { data } = await storesPagePromise;

  return <StoresSection storesBanner={data.banner} stores={data.stores} />;
}
