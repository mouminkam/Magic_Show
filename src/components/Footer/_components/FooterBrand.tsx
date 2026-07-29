import { Logo } from "@/components/Logo/Logo";

export default function FooterBrand() {
  return (
    <div className="text-ink-100">
      <Logo size={38} className="mb-6" />
      <p className="text-lg leading-8 text-ink-200">
        Footwear and leather goods lasted by hand in Damascus since 2016. Built to be
        resoled, not replaced.
      </p>
    </div>
  );
}
