// The live site sets SITE_ENV=production. Everything else (local, previews) stays
// hidden from search engines and allows placeholder text.
export const IS_PRODUCTION = process.env.SITE_ENV === "production";
export const SITE_URL = "https://ddrakelaw.com";
