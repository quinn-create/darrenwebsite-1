import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { IS_PRODUCTION, SITE_URL } from "@/lib/env";
import { businessGraph, jsonLd } from "@/lib/structured-data";
import { LIGHT_THEME, OPEN_GRAPH_BASE, PRACTICES, SHARE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import { THEME_COLOR, themeScript } from "@/lib/theme";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyCta } from "@/components/StickyCta";
import { ConsentLoader } from "@/components/consent/ConsentLoader";
import { TRACKERS, TRACKING_ON } from "@/lib/tracking";

// Manrope, Latin subset only (the site is English). next/font preloads the file and adds a
// size-matched Arial stand-in, so text doesn't re-wrap when the font arrives
// (plans/speed-check-plan.md). Licence: app/fonts/OFL.txt.
const manrope = localFont({
  src: "./fonts/manrope-latin-wght.woff2",
  weight: "200 800",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  variable: "--font-manrope",
  // Same range as the fontsource file it came from, so other characters fall back exactly as before.
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

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
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
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
        {/* Cookie banner and ad/statistics tags, only when an ID is set (plans/cookie-consent-plan.md). */}
        {TRACKING_ON && <ConsentLoader trackers={TRACKERS} />}
        <StickyCta practices={PRACTICES.map(({ slug, title }) => ({ slug, title }))} />
      </body>
    </html>
  );
}
