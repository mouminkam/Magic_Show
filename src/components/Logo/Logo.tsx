import Image from "next/image";
import clsx from "clsx";

/** Intrinsic aspect ratio of /public/images/logo.png (1336 x 840). */
const LOGO_ASPECT = 1336 / 840;

/**
 * The real Magic Show brand mark, sourced from the original site's
 * `public/images/logo.png`. Rendered at its native aspect ratio rather than
 * forced into a square tile, since the source asset isn't square.
 */
export function LogoMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const height = size;
  const width = Math.round(size * LOGO_ASPECT);
  return (
    <span
      className={clsx("inline-flex shrink-0 items-center justify-center", className)}
      style={{ height }}
    >
      <Image
        src="/images/logo.png"
        alt="Magic Show"
        width={width}
        height={height}
        priority
        style={{ height: "100%", width: "auto" }}
      />
    </span>
  );
}

export function Logo({
  wordmark = true,
  size = 36,
  className,
}: {
  wordmark?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <LogoMark size={size} />
      {wordmark ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-display truncate text-xl tracking-wide text-current">
            Magic Show
          </span>
          <span className="mt-0.5 truncate text-[10px] tracking-[0.2em] text-current opacity-60">
            HANDCRAFTED IN DAMASCUS
          </span>
        </span>
      ) : null}
    </span>
  );
}
