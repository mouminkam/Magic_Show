"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const SPRING = { damping: 30, stiffness: 100, mass: 2 } as const;

export interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  /** Maximum tilt in degrees at the edges of the card. */
  rotateAmplitude?: number;
  showTooltip?: boolean;
  overlayContent?: ReactNode;
}

/** Image card that tilts toward the cursor, with an optional floating caption. */
export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showTooltip = true,
  overlayContent,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const lastYRef = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const scale = useSpring(1, SPRING);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

  const [hasImageError, setHasImageError] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);

    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);

    // Tracked in a ref rather than state so cursor movement never re-renders.
    rotateFigcaption.set(-(offsetY - lastYRef.current) * 0.6);
    lastYRef.current = offsetY;
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
    opacity.set(1);
  };

  const handleMouseLeave = () => {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  };

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}
      >
        <motion.img
          src={hasImageError ? "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop" : imageSrc}
          alt={altText}
          onError={() => setHasImageError(true)}
          className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
          style={{ width: imageWidth, height: imageHeight }}
        />

        {overlayContent && (
          <motion.div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-surface px-[10px] py-[4px] text-[10px] text-ink opacity-0 z-[3] hidden sm:block"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
