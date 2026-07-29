import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getLanguage } from "@/lib/getLanguage";
import AuthHydrator from "@/components/auth/AuthHydrator";
import Footer from "@/components/Footer/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header/Header";
import Toast from "@/components/ui/Toast";
import VercelAnalytics from "@/components/VercelAnalytics";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/hooks/useTheme";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Magic Show — Footwear & Leather Goods",
    template: "%s · Magic Show",
  },
  description:
    "Footwear and leather goods lasted by hand in Damascus. Heels, boots, sandals, sneakers, bags and jewelry built to be resoled, not replaced.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await getLanguage();

  return (
    // `dir` is deliberately left unset: the existing layout is authored LTR and
    // flipping it would restyle every page.
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Leaflet ships its CSS separately from the JS bundle. */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Applies the persisted/system theme before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>

      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthHydrator />
          <Header lang={lang} />
          <main id="main">{children}</main>
          <Footer />
          <Toast />
          <VercelAnalytics />
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
