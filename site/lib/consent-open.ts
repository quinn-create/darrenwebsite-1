// Opening the cookie settings from the footer or the privacy page. Kept apart from
// lib/consent.ts so these buttons add only a few bytes to every page.
export const CONSENT_OPEN = "dd:consent-open";

// Footer and privacy-page buttons. The banner code loads just after the page, so a very early
// click is remembered and the settings open as soon as it arrives.
export function openCookieSettings(section?: "marketing") {
  (window as Window & { __ddConsentOpen?: { section?: string } }).__ddConsentOpen = { section };
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN, { detail: { section } }));
}

export function takePendingOpen(): { section?: string } | undefined {
  const w = window as Window & { __ddConsentOpen?: { section?: string } };
  const pending = w.__ddConsentOpen;
  delete w.__ddConsentOpen;
  return pending;
}
