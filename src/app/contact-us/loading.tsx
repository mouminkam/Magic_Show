export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-64 bg-line rounded-lg mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-line h-96 rounded-lg animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-8 bg-line rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-line rounded w-1/2 animate-pulse"></div>
          <div className="h-32 bg-line rounded w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
