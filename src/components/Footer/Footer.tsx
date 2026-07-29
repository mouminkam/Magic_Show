import FooterBackToTop from "./_components/FooterBackToTop";
import FooterBrand from "./_components/FooterBrand";
import FooterContact from "./_components/FooterContact";
import FooterInstagram from "./_components/FooterInstagram";

export default function Footer() {
  return (
    <>
      <footer className="bg-ink-900 text-ink-100 relative py-16 px-8 lg:px-0">
        <span className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-ink-200 text-sm opacity-40 tracking-[0.2em] whitespace-nowrap">
          FREE SHIPPING
        </span>

        <span className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-ink-200 text-sm opacity-40 tracking-[0.2em] whitespace-nowrap">
          24H SUPPORT
        </span>

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FooterBrand />
            <FooterContact />
            <FooterInstagram />
          </div>
        </div>
      </footer>

      <FooterBackToTop />
    </>
  );
}
