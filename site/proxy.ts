import { NextResponse, type NextRequest } from "next/server";

// Returns 410 ("gone") for old WordPress addresses that have no new equivalent,
// so search engines drop them instead of retrying. Redirects that do have a new
// page live in next.config.ts. Source: plans/signal-website-plan.md, Appendix B.
const GONE_BODY = "This page is no longer available. Visit https://ddrakelaw.com/ for Darren Drake, Attorney at Law.";

// Known old WordPress post/page IDs that map to a new page.
const KNOWN_IDS: Record<string, string> = { "12": "/" };

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/") {
    // WordPress search and ID-style addresses on the home page.
    if (searchParams.has("s")) return gone();
    const id = searchParams.get("page_id") ?? searchParams.get("p") ?? searchParams.get("attachment_id");
    if (id !== null) {
      const target = KNOWN_IDS[id];
      if (target) return NextResponse.redirect(new URL(target, request.url), 308);
      return gone();
    }
    return NextResponse.next();
  }

  return gone();
}

function gone() {
  return new NextResponse(GONE_BODY, {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

export const config = {
  matcher: [
    { source: "/", has: [{ type: "query", key: "s" }] },
    { source: "/", has: [{ type: "query", key: "p" }] },
    { source: "/", has: [{ type: "query", key: "page_id" }] },
    { source: "/", has: [{ type: "query", key: "attachment_id" }] },
    "/wp-login.php",
    "/xmlrpc.php",
    "/wp-admin/:path*",
    "/wp-includes/:path*",
    "/wp-json/:path*",
    "/wp-content/:path*",
    "/feed/:path*",
    "/comments/:path*",
    "/:path+/feed/:rest*",
    "/category/:path*",
    "/author/:path*",
    "/submit-a-testimonial/:path*",
    "/criminal-defense/john_drake/:path*",
    "/criminal-defense/tom_frost/:path*",
    // Spam addresses from the old junk sitemap: digits, then an underscore.
    "/(\\d+_[^/]*)/:rest*",
  ],
};
