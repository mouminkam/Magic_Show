import type { PageBanner } from "@/types";

export interface HeroBannerProps {
  /** Banner content. Rendering is skipped entirely when this is `null`. */
  banner: PageBanner | null;
  showGradient?: boolean;
  minHeight?: string;
  marginBottom?: string;
}

/**
 * Full-bleed page banner with a framed title and two rotated side badges.
 * Used at the top of the shop, blog, about, stores and contact pages.
 */
export default function HeroBanner({
  banner,
  showGradient = false,
  minHeight = "450px",
  marginBottom,
}: HeroBannerProps) {
  if (!banner || !banner.title.trim()) return null;

  const backgroundImage = banner.backgroundImage?.trim() || null;

  const sectionClasses = [
    "relative w-full mt-0 flex flex-col items-center justify-center",
    showGradient ? "" : "py-[112px]",
    marginBottom ?? "",
    "overflow-x-hidden",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={sectionClasses}
      style={{
        ...(backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : { backgroundColor: "#111827" }),
        minHeight,
      }}
    >
      {showGradient && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.5)_20%,_rgba(0,0,0,1)_100%)] z-[5] pointer-events-none" />
      )}

      <div className="container mx-auto px-4 w-full max-w-full">
        <div className="text-center text-white">
          <h1
            className="
              relative text-[40px] sm:text-[50px] lg:text-[70px] font-bold mb-4 tracking-widest inline-block p-15
              before:content-[''] before:absolute before:z-1
              before:left-15 before:top-2 before:right-15
              before:border-t-[9px] before:border-x-[9px] before:border-white before:border-solid
              before:h-[50px]
              after:content-[''] after:absolute after:z-1
              after:left-15 after:bottom-0 after:right-15
              after:border-b-[9px] after:border-x-[9px] after:border-white after:border-solid
              after:h-[50px]"
          >
            {banner.title}
          </h1>
        </div>
      </div>

      {banner.rightBadge ? (
        <span
          className="
            block text-[18px] leading-[20px] text-white
            absolute rotate-90
            lg:right-[-40px] lg:top-1/2
            max-lg:top-4 max-lg:right-auto max-lg:left-1/2 max-lg:translate-x-[-50%] max-lg:rotate-0 max-lg:mt-10 max-lg:max-w-full max-lg:px-4
            tracking-[3px] [word-spacing:4px] uppercase mr-[10px] opacity-50 whitespace-nowrap z-20
          "
        >
          {banner.rightBadge}
        </span>
      ) : null}

      {banner.leftBadge ? (
        <span
          className="
            block text-[18px] leading-[20px] text-white
            rotate-90 absolute
            lg:left-[-40px] lg:top-1/2
            max-lg:bottom-4 max-lg:left-1/2 max-lg:translate-x-[-50%] max-lg:top-auto max-lg:rotate-0 max-lg:mb-10 max-lg:max-w-full max-lg:px-4
            tracking-[3px] [word-spacing:4px] uppercase ml-[10px] opacity-50 whitespace-nowrap z-20
          "
        >
          {banner.leftBadge}
        </span>
      ) : null}
    </section>
  );
}
