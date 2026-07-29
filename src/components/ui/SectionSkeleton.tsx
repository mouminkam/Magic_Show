export type SectionSkeletonVariant = "default" | "grid";

export interface SectionSkeletonProps {
  variant?: SectionSkeletonVariant;
  /** Number of placeholder cards rendered by the `grid` variant. */
  cardCount?: number;
  /** Tailwind height class for the skeleton container. */
  height?: string;
  className?: string;
}

const SHIMMER = "skeleton";

/** Loading placeholder used as the Suspense fallback for lazy sections. */
export default function SectionSkeleton({
  variant = "default",
  cardCount = 6,
  height = "h-96",
  className = "",
}: SectionSkeletonProps) {
  if (variant === "grid") {
    return (
      <div className={`${height} w-full p-8 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: cardCount }, (_, index) => (
            <div key={index} className="rounded-lg border border-line overflow-hidden" style={{ height: "400px" }}>
              <div className="h-3/4 skeleton" />
              <div className="h-1/4 p-4 space-y-2">
                <div className="h-4 skeleton rounded w-3/4" />
                <div className="h-4 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${height} w-full p-8 ${className}`}>
      <div className="space-y-4">
        <div className={`${SHIMMER} h-8 rounded w-3/4`} />
        <div className={`${SHIMMER} h-4 rounded w-full`} />
        <div className={`${SHIMMER} h-4 rounded w-5/6`} />
        <div className={`${SHIMMER} h-4 rounded w-4/6`} />
        <div className={`${SHIMMER} h-64 rounded mt-8`} />
      </div>
    </div>
  );
}
