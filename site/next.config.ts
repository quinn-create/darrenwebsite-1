import type { NextConfig } from "next";

// Old ddrakelaw.com (WordPress) addresses -> new pages, one permanent (308) hop each.
// Source: plans/signal-website-plan.md, Appendix B. Addresses that should report
// "gone" (410) are handled in proxy.ts, because redirects() can't send 410.
const JUVENILE_TARGET = "/practice-areas/criminal-defense/"; // D5: the firm does not take juvenile cases (Darren, 24 Sep 2026)

const OLD_TO_NEW: [string, string][] = [
  ["/areas-of-practice", "/practice-areas/"],
  ["/areas-of-practice/criminaldefense", "/practice-areas/criminal-defense/"],
  ["/areas-of-practice/criminal-defense", "/practice-areas/criminal-defense/"],
  ["/criminal-defense", "/practice-areas/criminal-defense/"],
  ["/areas-of-practice/dui", "/practice-areas/dui-dwi/"],
  ["/dui", "/practice-areas/dui-dwi/"],
  ["/areas-of-practice/expungement", "/practice-areas/expungement/"],
  ["/expungement", "/practice-areas/expungement/"],
  ["/areas-of-practice/juvenile-defense", JUVENILE_TARGET],
  ["/juvenile-defense", JUVENILE_TARGET],
  ["/testimonials", "/about/"],
  ["/blog", "/"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/page-sitemap.xml", "/sitemap.xml"],
  ["/attachment-sitemap.xml", "/sitemap.xml"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  // WordPress attachment pages
  ["/areas-of-practice/divorce-2", "/practice-areas/"],
  ["/areas-of-practice/areas", "/practice-areas/"],
  ["/areas-of-practice/dui/dui-2", "/practice-areas/dui-dwi/"],
  ["/areas-of-practice/criminaldefense/criminal", "/practice-areas/criminal-defense/"],
  ["/areas-of-practice/expungement/expungement-2", "/practice-areas/expungement/"],
  ["/areas-of-practice/juvenile-defense/juvenile-2", JUVENILE_TARGET],
  ["/contact/ruco", "/contact/"],
  ["/testimonials/thank-you", "/about/"],
  ["/testimonials/darren-drake-attorney-murfreesboro-4", "/about/"],
  ["/criminal-defense/darren_drake", "/about/"],
  ["/criminal-defense/darren-drake", "/about/"],
  ["/criminal-defense/darren-drake-attorney-murfreesboro", "/about/"],
  ["/criminal-defense/drake-darren-web_0090a_pp", "/about/"],
  ["/criminal-defense/quote", "/about/"],
  ["/criminal-defense/1005495_10151868677697457_1901419547_n", "/about/"],
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The old site's addresses end in "/", so the new ones do too (one-hop redirects, same canonical style).
  trailingSlash: true,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      // Match both "/old" and "/old/" so every old address reaches its new page in a single hop.
      ...OLD_TO_NEW.flatMap(([from, to]) =>
        from.endsWith(".xml")
          ? [{ source: from, destination: to, permanent: true }]
          : [
              { source: from, destination: to, permanent: true },
              { source: `${from}/`, destination: to, permanent: true },
            ],
      ),
      // WordPress query-string addresses on the home page
      { source: "/", has: [{ type: "query", key: "page_id", value: "2" }], destination: "/contact/", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
