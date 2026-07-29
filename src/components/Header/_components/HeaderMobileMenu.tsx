"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo/Logo";
import type { NavItem } from "../Header";

export interface HeaderMobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
}

export default function HeaderMobileMenu({
  isOpen,
  navItems,
  onClose,
}: HeaderMobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[55]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-surface z-[60] shadow-2xl overflow-y-auto"
          >
            <div className="min-h-full">
              <div className="min-h-full p-6">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                  className="mb-6 flex justify-between items-center"
                >
                  <Link href="/" onClick={onClose}>
                    <Logo size={32} />
                  </Link>

                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                    aria-label="Close menu"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                <motion.nav
                  aria-label="Mobile navigation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col gap-4 py-4"
                >
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.4, ease: "easeOut" }}
                    >
                      <Link
                        href={item.href}
                        className="block text-base font-medium uppercase py-3 text-ink hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
