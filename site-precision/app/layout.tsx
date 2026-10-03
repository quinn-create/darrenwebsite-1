import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Darren Drake, Attorney at Law | Murfreesboro & Middle Tennessee",
    template: "%s | Darren Drake, Attorney at Law",
  },
  description:
    "Darren Drake, attorney at law in Murfreesboro and Middle Tennessee. Criminal defense, DUI/DWI and expungement. Start your intake or call (615) 546-5551.",
  robots: { index: false, follow: false }, // demo preview: keep out of search engines
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
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
      </body>
    </html>
  );
}
