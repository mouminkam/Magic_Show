export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-sunken py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-line rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-line rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-line rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
