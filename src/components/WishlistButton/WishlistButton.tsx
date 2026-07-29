"use client";

import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import useAuthStore from "@/store/authStore";
import useWishlistStore from "@/store/wishlistStore";

export type WishlistButtonVariant =
  | "default"
  | "minimal"
  | "overlay"
  | "bordered"
  | "white";

export interface WishlistButtonProps {
  productId: number;
  variant?: WishlistButtonVariant;
  className?: string;
  onSuccess?: () => void;
  onLoginRequired?: () => void;
}

const VARIANT_CLASSES: Record<WishlistButtonVariant, string> = {
  default:
    "w-9 h-9 bg-sunken hover:bg-sunken rounded-lg flex items-center justify-center transition-colors duration-200",
  minimal:
    "w-9 h-9 bg-sunken hover:bg-sunken rounded-lg flex items-center justify-center transition-colors duration-200",
  overlay:
    "w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110",
  bordered:
    "p-4 border-2 border-line-strong text-muted hover:border-brand rounded flex items-center justify-center transition-colors",
  white: "rounded-full flex items-center justify-center transition-all duration-300",
};

/**
 * Heart toggle shared by every product card and the product detail page.
 * Signed-out visitors are sent to `/login` with a return path.
 */
export default function WishlistButton({
  productId,
  variant = "default",
  className = "",
  onSuccess,
  onLoginRequired,
}: WishlistButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInWishlist = useWishlistStore((state) => state.productIds.has(productId));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isLoading = useWishlistStore((state) => state.isLoading);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      onLoginRequired?.();
      router.push(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }

    const result = await toggleWishlist(productId);
    if (result.success) onSuccess?.();
  };

  return (
    <button
      type="button"
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isInWishlist}
      disabled={isLoading}
      className={`${VARIANT_CLASSES[variant]} ${className}`}
      onClick={(event) => {
        void handleClick(event);
      }}
    >
      <Heart
        className={`${variant === "bordered" ? "w-7 h-7" : "w-4 h-4 md:w-5 md:h-5"} ${
          variant === "white"
            ? "text-white"
            : isInWishlist
              ? "fill-critical text-critical"
              : "text-muted"
        }`}
      />
    </button>
  );
}
