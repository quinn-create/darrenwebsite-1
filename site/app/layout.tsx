import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { IS_PRODUCTION, SITE_URL } from "@/lib/env";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyCta } from "@/components/StickyCta";

export const metadata: Metadata = {
  title: {
    default: "Darren Drake, Attorney at Law | Murfreesboro, Rutherford County & Smyrna",
    template: "%s | Darren Drake, Attorney at Law",
  },
  description:
    "Darren Drake, attorney at law serving Murfreesboro, Rutherford County and Smyrna. First-time offenses, DUI/DWI, domestic assault and other criminal defense. Start your intake or call (615) 546-5551.",
  metadataBase: new URL(SITE_URL),
  // Only the live site (SITE_ENV=production) may be indexed; previews stay out of search engines.
  robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#090F1C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <StickyCta />
      </body>
    </html>
  );
}
