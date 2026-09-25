import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { IS_PRODUCTION, SITE_URL } from "@/lib/env";
import { OPEN_GRAPH_BASE, SHARE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyCta } from "@/components/StickyCta";

export const metadata: Metadata = {
  title: {
    default: "Darren Drake, Attorney at Law | Murfreesboro, Rutherford County & Smyrna",
    template: "%s | Darren Drake, Attorney at Law",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  // Link previews. Images come from app/opengraph-image.tsx and twitter-image.tsx
  // (practice pages have their own); plans/link-previews-plan.md.
  openGraph: OPEN_GRAPH_BASE,
  twitter: { card: "summary_large_image", title: SHARE_TITLE },
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
        <ScrollReveal />
        <Footer />
        <StickyCta />
      </body>
    </html>
  );
}
