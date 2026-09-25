// The few shared values that browser (client) components need. Kept apart from lib/site.ts,
// which holds all the page wording, so that wording is never bundled into JavaScript
// (plans/speed-check-plan.md). lib/site.ts re-exports everything here.

export const PHONE_DISPLAY = "(615) 546-5551";
export const PHONE_HREF = "tel:+16155465551";

// `short` is the label on the phone-size tab bar, where four tabs share one row.
// `desktop: false` leaves an item out of the desktop tabs (the "Contact us" button covers it).
export const NAV = [
  { href: "/", label: "Home", short: "Home" },
  { href: "/practice-areas/", label: "Practice Areas", short: "Practice" },
  { href: "/about/", label: "About Darren", short: "About" },
  { href: "/contact/", label: "Contact", short: "Contact", desktop: false },
] as const;

// The main call to action everywhere on the site. The form lives on the Contact page;
// the old /intake/ address redirects there.
export const CTA_LABEL = "Contact us";
export const CTA_HREF = "/contact/";

// Gentle scroll reveals (plans/scroll-reveals-plan.md). false turns them off everywhere.
export const SCROLL_REVEALS = true;

// Light theme option (plans/light-theme-plan.md). false removes the header button and the
// theme script, and the site is dark only. THEME_DEFAULT "system" would start visitors who
// haven't chosen on their device's light/dark setting; "dark" keeps the Signal design first.
export const LIGHT_THEME = true;
export const THEME_DEFAULT: "dark" | "system" = "dark";

export const INTAKE_SUCCESS =
  "Your inquiry was received. Submitting it does not establish representation.";
