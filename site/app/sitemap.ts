import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { PRACTICES } from "@/lib/site";

const BUILD_DATE = new Date().toISOString();

// Last git commit date of the files behind a page, read at build time. Falls back to the
// build date when git (or the history) isn't available, e.g. a shallow deploy checkout.
function lastModified(files: string[]) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...files], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out ? new Date(out).toISOString() : BUILD_DATE;
  } catch {
    return BUILD_DATE;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Practice pages share one template, and their wording lives in lib/site.ts.
  const practiceFiles = ["app/practice-areas/[slug]/page.tsx", "lib/site.ts"];
  const pages: [string, string[]][] = [
    ["/", ["app/page.tsx", "lib/site.ts"]],
    ["/practice-areas/", ["app/practice-areas/page.tsx", "lib/site.ts"]],
    ...PRACTICES.map((p): [string, string[]] => [`/practice-areas/${p.slug}/`, practiceFiles]),
    ["/about/", ["app/about/page.tsx"]],
    ["/contact/", ["app/contact/page.tsx"]],
    ["/privacy/", ["app/privacy/page.tsx"]],
    ["/accessibility/", ["app/accessibility/page.tsx"]],
    ["/legal-notice/", ["app/legal-notice/page.tsx"]],
  ];
  return pages.map(([path, files]) => ({ url: `${SITE_URL}${path}`, lastModified: lastModified(files) }));
}
