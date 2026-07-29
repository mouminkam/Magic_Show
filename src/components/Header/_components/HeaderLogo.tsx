import Link from "next/link";
import { Logo } from "@/components/Logo/Logo";

export default function HeaderLogo() {
  return (
    <div className="shrink-0 z-10">
      <Link
        href="/"
        className="inline-flex items-center p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rust-500 focus-visible:ring-offset-2 rounded"
        aria-label="Magic Show — go to homepage"
      >
        <Logo size={34} />
      </Link>
    </div>
  );
}
