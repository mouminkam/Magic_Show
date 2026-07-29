export default function StoresLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-64 skeleton rounded-lg mb-8"></div>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 skeleton rounded"></div>
        ))}
      </div>
    </div>
  );
}
