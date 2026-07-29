import type { ReactNode } from "react";

export interface ShopShellProps {
  banner: ReactNode;
  top: ReactNode;
  sidebar: ReactNode;
  products: ReactNode;
  className?: string;
}

/** Layout frame for `/shop`; each slot is streamed in independently. */
export default function ShopShell({
  banner,
  top,
  sidebar,
  products,
  className = "",
}: ShopShellProps) {
  return (
    <div className={className}>
      {banner}

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {top}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <aside className="lg:col-span-1">{sidebar}</aside>
          <section className="lg:col-span-3">{products}</section>
        </div>
      </main>
    </div>
  );
}
