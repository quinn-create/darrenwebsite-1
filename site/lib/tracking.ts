// Advertising and statistics tags (plans/cookie-consent-plan.md). Each loads only after the
// visitor agrees in the cookie banner, and only if its ID is set in Vercel. With no IDs set,
// there is no banner, no footer cookie links and no tracking code at all.
// Values are read at build time (NEXT_PUBLIC_*), so change them in Vercel, then redeploy.

const pick = (value: string | undefined, pattern: RegExp) => {
  const v = value?.trim();
  return v && pattern.test(v) ? v : "";
};

export const TRACKERS = {
  // Google Analytics 4 measurement ID, e.g. G-ABC123XYZ9
  ga: pick(process.env.NEXT_PUBLIC_GA_ID, /^G-[A-Z0-9]{4,}$/),
  // Google Ads account tag, e.g. AW-123456789, plus the conversion labels for a sent form and a phone tap
  ads: pick(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d{5,}$/),
  adsLeadLabel: pick(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL, /^[\w-]{4,}$/),
  adsCallLabel: pick(process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL, /^[\w-]{4,}$/),
  // Meta (Facebook/Instagram) Pixel ID, digits only
  meta: pick(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{6,20}$/),
};

export type Trackers = typeof TRACKERS;

export const HAS_ANALYTICS = Boolean(TRACKERS.ga);
export const HAS_MARKETING = Boolean(TRACKERS.ads || TRACKERS.meta);
export const TRACKING_ON = HAS_ANALYTICS || HAS_MARKETING;
