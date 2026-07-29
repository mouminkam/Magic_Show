"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PaginationControls from "./PaginationControls";

export interface ShopPaginationClientProps {
  currentPage: number;
  totalPages: number;
}

/** Wires pagination clicks to the `page` search param. */
export default function ShopPaginationClient({
  currentPage,
  totalPages,
}: ShopPaginationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("page", String(page));
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
