"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface AnimatedSectionProps {
  children: ReactNode;
  /** Seconds to wait before the animation starts. */
  delay?: number;
}

/**
 * Fades and lifts a section into view the first time it is scrolled to.
 * Only `opacity` and `y` are animated — both are compositor-friendly.
 */
export default function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
