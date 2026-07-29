import Image from "next/image";
import Link from "next/link";
import { products } from "@/mocks/data/products";
import { resolveImageUrl } from "@/lib/utils/imageUtils";

/**
 * "Instagram feed" grid. Rather than hard-coding image paths, it links the eight
 * best-selling products, so every tile always resolves to a real product page.
 */
export default function FooterInstagram() {
  const feed = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);

  return (
    <div className="text-ink-100">
      <h3 className="font-display text-xl mb-6 text-white">Instagram feed</h3>
      <div className="grid grid-cols-4 gap-2">
        {feed.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="block relative group overflow-hidden rounded border border-ink-600 transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-lg)] aspect-square"
            aria-label={product.name}
          >
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <Image
                src={resolveImageUrl(product.featuredImage)}
                alt={product.name}
                width={100}
                height={100}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-2">
              <span className="text-white text-xs font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                View
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
