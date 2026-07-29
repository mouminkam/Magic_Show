export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-ink-900 mb-4" />
        <p className="text-muted">جاري التحميل...</p>
      </div>
    </div>
  );
}
