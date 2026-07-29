export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner Skeleton */}
      <div className="w-full h-48 skeleton rounded-lg mb-8"></div>

      {/* Blog Posts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="">
            <div className="skeleton h-48 rounded-lg mb-4"></div>
            <div className="h-6 skeleton rounded w-3/4 mb-3"></div>
            <div className="h-4 skeleton rounded w-full mb-2"></div>
            <div className="h-4 skeleton rounded w-5/6 mb-3"></div>
            <div className="flex gap-4">
              <div className="h-4 skeleton rounded w-24"></div>
              <div className="h-4 skeleton rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
