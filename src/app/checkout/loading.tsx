const FIELD_PLACEHOLDERS = [1, 2, 3, 4, 5, 6];

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-line rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {FIELD_PLACEHOLDERS.map((index) => (
                <div key={index} className="h-12 bg-line rounded" />
              ))}
            </div>
            <div className="h-64 bg-line rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
