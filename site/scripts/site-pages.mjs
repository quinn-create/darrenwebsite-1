// Shared by the check scripts: the site's pages, read from its own sitemap.xml
// (so a new page is checked automatically), rewritten to the server being tested.
export const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function sitePages() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (!paths.length) throw new Error(`No pages found in ${BASE}/sitemap.xml`);
  return paths;
}
