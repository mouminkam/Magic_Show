export default function OrderConfirmationLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="h-10 skeleton rounded w-2/3 mx-auto mb-8" />
        <div className="h-48 skeleton rounded mb-6" />
        <div className="h-32 skeleton rounded mb-6" />
      </div>
    </div>
  );
}
