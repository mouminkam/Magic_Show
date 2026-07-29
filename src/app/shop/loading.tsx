const FILTER_PLACEHOLDERS = [1, 2, 3, 4];
const CARD_PLACEHOLDERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-64 bg-gray-200 rounded-lg mb-8 animate-pulse" />

      <div className="flex gap-8 mb-8">
        <div className="w-64 space-y-4">
          {FILTER_PLACEHOLDERS.map((index) => (
            <div key={index} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARD_PLACEHOLDERS.map((index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
