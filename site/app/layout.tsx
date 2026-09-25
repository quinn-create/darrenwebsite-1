import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { IS_PRODUCTION, SITE_URL } from "@/lib/env";
import { businessGraph, jsonLd } from "@/lib/structured-data";
import { LIGHT_THEME, OPEN_GRAPH_BASE, SHARE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import { THEME_COLOR, themeScript } from "@/lib/theme";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyCta } from "@/components/StickyCta";

export const metadata: Metadata = {
  title: {
    default: "Darren Drake, Attorney at Law | Murfreesboro, TN",
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
  // With the light theme, the theme-color tag is rendered in <head> below so scripts can change it.
  ...(LIGHT_THEME ? {} : { themeColor: THEME_COLOR.dark }),
  // The light theme (plans/light-theme-plan.md) switches color-scheme in globals.css.
  colorScheme: LIGHT_THEME ? "dark light" : "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The theme script edits <html> before React loads, hence suppressHydrationWarning.
    <html lang="en" suppressHydrationWarning>
      {LIGHT_THEME && (
        <head>
          <meta name="theme-color" content={THEME_COLOR.dark} />
          <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
        </head>
      )}
      <body className="antialiased">
        {/* Business details for search engines (plans/seo-fixes-plan.md). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessGraph()) }} />
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
