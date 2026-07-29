"use client";

import { useState } from "react";
import { Scale, Star } from "lucide-react";
import type { ProductDetail } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductFullUrl, getProductThumbUrl } from "@/lib/utils/imageUtils";
import Button from "@/components/Button";
import OptimizedImage from "@/components/ui/OptimizedImage";
import WishlistButton from "@/components/WishlistButton/WishlistButton";
import SocialMediaIcons from "@/components/SocialMediaIcons";

export interface ProductSectionProps {
  product: ProductDetail;
}

const STAR_POSITIONS = [1, 2, 3, 4, 5];

/** Product gallery, variant pickers, quantity stepper and add-to-cart. */
export default function ProductSection({ product }: ProductSectionProps) {
  const { addLine } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] ?? null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fullImages = product.images.map((image) => getProductFullUrl(image));
  const thumbImages = product.images.map((image) => getProductThumbUrl(image));
  const activeImage = fullImages[activeImageIndex] ?? fullImages[0] ?? "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop";

  const maxQuantity = Math.max(1, product.stockQuantity);

  const handleQuantityInput = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    setQuantity(Math.min(Math.max(parsed, 1), maxQuantity));
  };

  const handleAddToCart = () => {
    addLine({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: thumbImages[activeImageIndex] ?? thumbImages[0] ?? "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop",
      quantity,
      size: selectedSize,
      color: selectedColor,
      maxQuantity: product.stockQuantity,
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      <section className="py-8 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="lg:w-3/5">
              <div className="mb-4 overflow-hidden bg-ink-50 border border-ink-100">
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <OptimizedImage
                      src={activeImage}
                      alt={product.name}
                      fill
                      className="w-full h-full"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority={activeImageIndex === 0}
                    />
                  </div>
                </div>
              </div>

              {thumbImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {thumbImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Show image ${index + 1} of ${thumbImages.length}`}
                      aria-pressed={activeImageIndex === index}
                      className={`relative aspect-square w-full border overflow-hidden transition-all bg-ink-50 ${
                        activeImageIndex === index ? "border-ink-900" : "border-ink-100 hover:border-ink-200"
                      }`}
                    >
                      <div className="absolute inset-0 w-full h-full">
                        <OptimizedImage
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="w-full h-full"
                          sizes="25vw"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:w-2/5">
              <p className="text-rust-500 text-xs font-semibold uppercase tracking-[0.14em] mb-3">
                {product.code}
              </p>
              <h1 className="font-display text-3xl md:text-[2.5rem] leading-[1.1] text-ink-900 mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {STAR_POSITIONS.map((position) => (
                    <Star
                      key={position}
                      className={`w-4 h-4 ${
                        position <= Math.round(product.rating)
                          ? "fill-rust-500 text-rust-500"
                          : "text-ink-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-ink-400">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-ink-100">
                <span className="text-3xl font-semibold text-ink-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice !== null && (
                  <span className="text-lg text-ink-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-ink-600 mb-8 leading-7">{product.descriptionText}</p>

              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <span className="text-ink-900 text-sm font-medium uppercase tracking-[0.08em] block mb-3">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={selectedSize === size}
                        className={`min-w-11 px-3 py-2 border text-sm uppercase font-medium transition-all ${
                          selectedSize === size
                            ? "border-ink-900 bg-ink-900 text-white"
                            : "border-ink-200 text-ink-600 hover:border-ink-900"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors.length > 0 && (
                <div className="mb-6">
                  <label
                    htmlFor="product-color"
                    className="text-ink-900 text-sm font-medium uppercase tracking-[0.08em] block mb-3"
                  >
                    Color
                  </label>
                  <select
                    id="product-color"
                    value={selectedColor ?? ""}
                    onChange={(event) => setSelectedColor(event.target.value)}
                    className="border border-ink-200 px-4 py-2.5 text-ink-900 font-medium outline-none w-full sm:w-auto"
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-8">
                <span className="text-ink-900 text-sm font-medium uppercase tracking-[0.08em] block mb-3">
                  Quantity
                </span>
                <div className="flex w-fit border border-ink-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="px-4 py-2.5 text-ink-600 text-lg disabled:cursor-not-allowed disabled:opacity-40 hover:bg-ink-900 hover:text-white transition-all"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Quantity"
                    value={quantity.toString().padStart(2, "0")}
                    onChange={(event) => handleQuantityInput(event.target.value)}
                    className="w-14 text-center text-base py-2.5 text-ink-900 font-semibold outline-none border-x border-ink-200"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                    disabled={quantity >= maxQuantity}
                    aria-label="Increase quantity"
                    className="px-4 py-2.5 text-ink-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-ink-900 hover:text-white transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <Button onClick={handleAddToCart} variant="secondary" size="lg" disabled={!product.inStock} className="flex-1">
                  {product.inStock ? "Add to Cart" : "Out of stock"}
                </Button>

                <WishlistButton productId={product.id} variant="bordered" />
                <button
                  type="button"
                  aria-label="Compare product"
                  className="p-4 border border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900 transition-colors"
                >
                  <Scale className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-ink-100">
                <span className="text-xs uppercase tracking-[0.1em] text-ink-400">Share</span>
                <SocialMediaIcons variant="default" size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
