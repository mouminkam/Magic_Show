"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "../Header";

export interface HeaderNavigationProps {
  navItems: NavItem[];
}

export default function HeaderNavigation({ navItems }: HeaderNavigationProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem): boolean =>
    item.href === "/" ? pathname === "/" : (pathname?.startsWith(item.href) ?? false);

  return (
    <nav aria-label="Main navigation" className="flex items-center gap-8 xl:gap-10">
      {navItems.map((item) => {
        const active = isActive(item);
        return (
          <div key={item.key} className="relative group">
            <Link
              href={item.href}
              className={`relative text-sm font-medium uppercase tracking-wide transition-all duration-300 pb-1 rounded ${
                active ? "text-orange-500" : "text-ink hover:text-orange-500"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.name}
              {active ? (
                <span className="absolute -bottom-1 left-0 h-0.5 bg-orange-500 w-full" />
              ) : (
                <span className="absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 w-0 group-hover:w-full" />
              )}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
