"use client";

import { useEffect } from "react";
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

export default function ProfileWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useWishlistStore((s) => s.items);
  const isLoading = useWishlistStore((s) => s.isLoading);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const { addLine, openCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  return (
    <div className="bg-surface rounded-lg shadow-[var(--shadow-sm)] border border-line p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold text-ink">Wishlist</h2>
        <span className="text-sm text-muted">{items?.length ?? 0}</span>
      </div>

      {!isAuthenticated ? (
        <div className="min-h-[180px] flex items-center justify-center">
          <div className="text-center px-4">
            <Heart className="w-10 h-10 text-faint mx-auto mb-3" />
            <p className="text-ink font-medium">Sign in to view your wishlist</p>
            <p className="text-muted text-sm mt-1">Create an account or sign in to save your favorite products.</p>
            <Link
              href="/login?redirect=/profile"
              className="mt-4 inline-flex px-4 py-2 text-sm font-medium text-white bg-brand rounded-sm hover:bg-brand-hover"
            >
              Sign In
            </Link>
          </div>
        </div>
      ) : isLoading && (items?.length ?? 0) === 0 ? (
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-sunken rounded-lg" />
          ))}
        </div>
      ) : (items?.length ?? 0) === 0 ? (
        <div className="min-h-[180px] flex items-center justify-center">
          <div className="text-center px-4">
            <Heart className="w-10 h-10 text-faint mx-auto mb-3" />
            <p className="text-ink font-medium">Your wishlist is empty</p>
            <p className="text-muted text-sm mt-1">Save items you love by clicking the heart icon on any product.</p>
            <Link
              href="/shop"
              className="mt-4 inline-flex px-4 py-2 text-sm font-medium text-white bg-brand rounded-sm hover:bg-brand-hover"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => {
            const productId = item.productId;
            const imageSrc = getProductMediumUrl(item) || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop";
            const thumbForCart = getProductThumbUrl(item) || imageSrc;

            return (
              <div
                key={item.id}
                className="group relative bg-surface border border-line rounded-lg overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow"
              >
                <Link href={`/shop/${productId}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-sunken">
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.discount && (
                      <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                        -{item.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-muted text-xs uppercase tracking-wide mb-1">{item.category}</p>
                    <h3 className="font-medium text-ink line-clamp-2 mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      {item.originalPrice && (
                        <span className="text-faint text-sm line-through">${item.originalPrice}</span>
                      )}
                      <span className="font-bold text-ink">${Number(item.price).toFixed(2)}</span>
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
                    variant="secondary"
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
      )}
    </div>
  );
}
