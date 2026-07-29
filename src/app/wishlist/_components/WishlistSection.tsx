"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import type { CartItem, WishlistItem } from "@/types";
import Button from "@/components/Button";
import useWishlistStore from "@/store/wishlistStore";
import { useCart } from "@/hooks/useCart";
import useAuthStore from "@/store/authStore";
import { getProductMediumUrl, getProductThumbUrl } from "@/lib/utils/imageUtils";

function toCartLine(item: WishlistItem, image: string): CartItem {
  return {
    id: item.productId,
    productId: item.productId,
    name: item.name,
    slug: item.slug,
    price: item.price,
    image,
    quantity: 1,
    size: null,
    color: null,
    maxQuantity: item.inStock ? 999 : 0,
  };
}

export default function WishlistSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useWishlistStore((s) => s.items);
  const isLoading = useWishlistStore((s) => s.isLoading);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const { addLine, openCart } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sunken mt-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4 animate-in-up">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
            <Heart className="w-7 h-7 text-brand" strokeWidth={1.75} />
          </div>
          <h2 className="text-xl font-semibold text-ink mb-2">
            Sign in to view your wishlist
          </h2>
          <p className="text-muted mb-6">
            Create an account or sign in to save your favorite products.
          </p>
          <Link href="/login?redirect=/profile">
            <Button variant="primary" size="md">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-sunken mt-20">
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-8 skeleton rounded w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-line overflow-hidden">
                  <div className="skeleton aspect-[3/4]" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 skeleton rounded w-1/3" />
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-sunken mt-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4 animate-in-up">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
            <Heart className="w-7 h-7 text-brand" strokeWidth={1.75} />
          </div>
          <h2 className="text-xl font-semibold text-ink mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted mb-6">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="md">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sunken mt-20">
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <span className="eyebrow">Saved for later</span>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-ink mb-8">
            My Wishlist ({items.length})
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => {
              const productId = item.productId;
              const imageSrc = getProductMediumUrl(item) || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop";
              const thumbForCart = getProductThumbUrl(item) || imageSrc;

              return (
                <div
                  key={item.id}
                  className="group relative bg-surface border border-line rounded-lg overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow animate-in-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                >
                  <Link href={`/shop/${productId}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-sunken">
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.discount && (
                        <div className="absolute top-3 right-3 bg-ink-900 text-white text-xs font-medium px-2 py-1 rounded font-mono tnum">
                          -{item.discount}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="eyebrow mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-medium text-ink line-clamp-2 mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {item.originalPrice && (
                          <span className="text-faint text-sm line-through tnum">
                            ${item.originalPrice}
                          </span>
                        )}
                        <span className="font-semibold text-ink tnum">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        void removeFromWishlist(productId);
                      }}
                      aria-label="Remove from wishlist"
                      className="w-9 h-9 bg-surface/90 hover:bg-critical-soft rounded-full flex items-center justify-center shadow-[var(--shadow-md)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-muted hover:text-critical" />
                    </button>
                  </div>
                  <div className="p-4 pt-0">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        addLine(toCartLine(item, thumbForCart));
                        openCart();
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
