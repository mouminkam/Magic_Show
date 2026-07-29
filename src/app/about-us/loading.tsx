export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <div className="text-center mb-16">
        <div className="h-10 skeleton rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-6 skeleton rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-6 skeleton rounded w-2/3 mx-auto"></div>
      </div>

      {/* Team Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-32 h-32 skeleton rounded-full mx-auto mb-4"></div>
            <div className="h-6 skeleton rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 skeleton rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-12 skeleton rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 skeleton rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
