import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sunken">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-ink mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-ink mb-4">الصفحة غير موجودة</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
