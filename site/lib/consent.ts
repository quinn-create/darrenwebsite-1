// The visitor's cookie choices, stored in a first-party cookie (plans/cookie-consent-plan.md).
// Browser-only helpers; import from client components.

export const CONSENT_COOKIE = "dd_consent";
// Bump when a new tag or category is added: everyone is asked again.
export const CONSENT_REVISION = 1;
const MAX_AGE_DAYS = 182;

export type Consent = {
  v: number;
  analytics: boolean;
  marketing: boolean;
  gpc: boolean; // the browser sent Global Privacy Control
  at: string; // when the choice was made (ISO date)
};

export const CONSENT_CHANGE = "dd:consent-change";
export { CONSENT_OPEN, takePendingOpen } from "./consent-open";

export function gpcOn(): boolean {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function readConsent(): Consent | null {
  const raw = document.cookie.split("; ").find((c) => c.startsWith(CONSENT_COOKIE + "="));
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1))) as Consent;
    return c.v === CONSENT_REVISION ? c : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; marketing: boolean }): Consent {
  const gpc = gpcOn();
  // Global Privacy Control is an opt-out of "sharing" for advertising, so it always wins for marketing.
  const c: Consent = { v: CONSENT_REVISION, analytics: choice.analytics, marketing: choice.marketing && !gpc, gpc, at: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}; Max-Age=${MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  if (!c.analytics) clearCookies(/^(_ga|_gid|_gat)/);
  if (!c.marketing) clearCookies(/^(_gcl_|_fbp$|_fbc$)/);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE, { detail: c }));
  return c;
}

// Deletes tracker cookies set on this host or its parent domain (Google and Meta use both).
function clearCookies(names: RegExp) {
  const host = location.hostname;
  const parts = host.split(".");
  const domains = ["", host, "." + host];
  if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
  for (const pair of document.cookie.split("; ")) {
    const name = pair.split("=")[0];
    if (!names.test(name)) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
  }
}
