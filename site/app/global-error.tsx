"use client";

import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site-basics";

// Last-resort error page, used only if the site's main layout itself fails. It replaces the whole
// document, so it has its own <html> and plain inline styles (the site's stylesheet may not have
// loaded) and fetches nothing. The phone number keeps the office reachable.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#090F1C", color: "#F4F7FC", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <title>Something went wrong | Darren Drake, Attorney at Law</title>
        <meta name="robots" content="noindex" />
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "96px 20px", lineHeight: 1.6, fontSize: 18 }}>
          <p style={{ fontWeight: 800, letterSpacing: "0.02em", margin: 0 }}>DARREN DRAKE · Attorney at Law</p>
          <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: "24px 0 16px" }}>Something went wrong</h1>
          <p style={{ color: "#CAD4E2", margin: 0 }}>
            The website didn&apos;t load. Please try again, or call the office at{" "}
            <a href={PHONE_HREF} style={{ color: "#67E8F9", fontWeight: 700 }}>
              {PHONE_DISPLAY}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 32,
              minHeight: 52,
              padding: "0 26px",
              border: 0,
              borderRadius: 999,
              background: "#67E8F9",
              color: "#090F1C",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
