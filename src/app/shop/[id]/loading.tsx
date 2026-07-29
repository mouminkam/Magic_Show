export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-64 bg-gray-200 rounded-lg mb-8 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-200 h-96 rounded-lg animate-pulse" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-20 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-12 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
