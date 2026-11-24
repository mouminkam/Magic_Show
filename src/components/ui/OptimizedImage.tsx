"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/utils/imageUtils";

type SharedImageProps = Omit<ImageProps, "src" | "alt" | "fill" | "width" | "height" | "onError">;

export type OptimizedImageProps = SharedImageProps & {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
} & (
    | { fill: true; width?: never; height?: never }
    | { fill?: false; width: number; height: number }
  );

/**
 * `next/image` with a loading shimmer and a graceful fallback.
 *
 * The `fill` / `width`+`height` pair is a discriminated union, so passing
 * `fill` together with explicit dimensions — which `next/image` rejects at
 * runtime — is a compile error instead.
 */
export default function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = hasError ? FALLBACK_IMAGE : src;
  const opacityClass = isLoading ? "opacity-0" : "opacity-100";

  const shared = {
    src: resolvedSrc,
    alt,
    quality,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    priority,
    onLoad: () => setIsLoading(false),
    onError: () => {
      setIsLoading(false);
      setHasError(true);
    },
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <div className="absolute inset-0 skeleton" />}

      {props.fill ? (
        <Image
          {...props}
          {...shared}
          alt={alt}
          fill
          className={`transition-opacity duration-300 object-cover ${opacityClass}`}
        />
      ) : (
        <Image
          {...props}
          {...shared}
          alt={alt}
          width={props.width}
          height={props.height}
          className={`transition-opacity duration-300 ${opacityClass}`}
        />
      )}
    </div>
  );
}
