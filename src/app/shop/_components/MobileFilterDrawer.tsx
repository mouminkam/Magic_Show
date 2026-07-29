"use client";

import { useEffect, useRef, type ReactNode } from "react";

export interface MobileFilterDrawerProps {
  children: ReactNode;
  open: boolean;
  onRequestClose: () => void;
}

/** Slide-in filter panel for viewports below `lg`. */
export default function MobileFilterDrawer({
  children,
  open,
  onRequestClose,
}: MobileFilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && !drawerRef.current?.contains(target)) {
        onRequestClose();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onRequestClose();
    };

    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRequestClose]);

  return (
    <div>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        className={`fixed z-40 inset-y-0 left-0 w-full max-w-full sm:max-w-xs bg-surface rounded-r-none sm:rounded-r-xl shadow-lg transition-transform duration-300 ease-in-out p-6 overflow-y-auto will-change-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
