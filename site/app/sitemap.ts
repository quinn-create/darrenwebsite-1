import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { PRACTICES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/practice-areas/",
    ...PRACTICES.map((p) => `/practice-areas/${p.slug}/`),
    "/about/",
    "/contact/",
    "/intake/",
    "/privacy/",
    "/accessibility/",
    "/legal-notice/",
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
