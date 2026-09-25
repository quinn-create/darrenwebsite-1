"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONSENT_CHANGE, CONSENT_OPEN, gpcOn, readConsent, takePendingOpen, writeConsent, type Consent as Choice } from "@/lib/consent";
import { queuedEvents, type TrackedEvent } from "@/lib/analytics";
import type { Trackers } from "@/lib/tracking";

// Cookie banner, cookie settings dialog, and the tags they allow (plans/cookie-consent-plan.md).
// Loaded only when at least one tracker ID is set (components/consent/ConsentLoader.tsx).
//
// Rules:
// - Nothing from Google or Meta loads until the visitor accepts that category.
// - Accept, reject and manage are equally prominent; closing the dialog never accepts.
// - Global Privacy Control turns marketing off and skips the banner.
// - Never sent: form contents, names, phone numbers, emails, or address query strings
//   (?topic=… would reveal the matter). Conversions send only the event name.
// - Google is told not to personalise ads from these visits (no remarketing audiences;
//   Google doesn't allow them for crime-related legal services anyway).

type W = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
  _fbq?: unknown;
};

function loadScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

// The address to report: path only, never the query string.
const cleanUrl = () => location.origin + location.pathname;

function setUpGoogle(t: Trackers, c: Choice) {
  const w = window as W;
  if (!w.gtag) {
    w.dataLayer = w.dataLayer ?? [];
    // gtag must queue the `arguments` object itself, not an array copy.
    w.gtag = function gtag() {
      w.dataLayer!.push(arguments);
    };
    w.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    w.gtag("set", { page_location: cleanUrl() });
    w.gtag("js", new Date());
  }
  const useGa = c.analytics && t.ga;
  const useAds = c.marketing && t.ads;
  w.gtag("consent", "update", {
    analytics_storage: useGa ? "granted" : "denied",
    ad_storage: useAds ? "granted" : "denied",
    ad_user_data: useAds ? "granted" : "denied",
    ad_personalization: "denied",
  });
  if (!useGa && !useAds) return;
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${useGa ? t.ga : t.ads}`);
  if (useGa) w.gtag("config", t.ga, { send_page_view: false, page_location: cleanUrl(), allow_google_signals: false });
  if (useAds) w.gtag("config", t.ads, { allow_ad_personalization_signals: false, page_location: cleanUrl() });
}

function setUpMeta(t: Trackers, c: Choice) {
  const w = window as W;
  if (!t.meta) return;
  if (!c.marketing) {
    if (w.fbq) w.fbq("consent", "revoke");
    return;
  }
  if (!w.fbq) {
    // Meta's standard loader, written out: queue calls until fbevents.js arrives.
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void)(...args);
      else fbq.queue.push(args);
    } as W["fbq"] & { queue: unknown[]; push: unknown; loaded: boolean; version: string };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    w.fbq = fbq;
    w._fbq = fbq;
    loadScript("https://connect.facebook.net/en_US/fbevents.js");
    // No automatic form scanning or "advanced matching": only the events we send.
    fbq("set", "autoConfig", false, t.meta);
    fbq("init", t.meta);
  }
  w.fbq!("consent", "grant");
}

function pageView(t: Trackers, c: Choice) {
  const w = window as W;
  if (c.analytics && t.ga && w.gtag) w.gtag("event", "page_view", { send_to: t.ga, page_location: cleanUrl(), page_title: document.title });
  if (c.marketing && t.meta && w.fbq) w.fbq("track", "PageView");
}

// A form was accepted by the server, or the phone number was tapped. Event names only.
function conversion(t: Trackers, c: Choice, kind: "lead" | "call") {
  const w = window as W;
  if (c.analytics && t.ga && w.gtag) w.gtag("event", kind === "lead" ? "generate_lead" : "phone_tap", { send_to: t.ga });
  const label = kind === "lead" ? t.adsLeadLabel : t.adsCallLabel;
  if (c.marketing && t.ads && label && w.gtag) w.gtag("event", "conversion", { send_to: `${t.ads}/${label}` });
  if (c.marketing && t.meta && w.fbq) w.fbq("track", kind === "lead" ? "Lead" : "Contact");
}

export default function Consent({ trackers }: { trackers: Trackers }) {
  const pathname = usePathname();
  // First load (this component never renders on the server, so the cookie can be read here):
  // the stored choice, or Global Privacy Control honoured without asking.
  const [choice, setChoice] = useState<Choice | null>(() => {
    const g = gpcOn();
    let c = readConsent();
    if (!c && g) c = writeConsent({ analytics: false, marketing: false });
    else if (c && g && c.marketing) c = writeConsent({ analytics: c.analytics, marketing: false });
    return c;
  });
  const [gpc] = useState(gpcOn);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const marketingBox = useRef<HTMLInputElement>(null);
  const choiceRef = useRef(choice);
  const applied = useRef(false); // tags set up for this page load
  useEffect(() => {
    choiceRef.current = choice;
  }, [choice]);
  const showAnalytics = Boolean(trackers.ga);
  const showMarketing = Boolean(trackers.ads || trackers.meta);

  // Keep ?topic=… (it names the legal matter) out of any address a tag could read.
  const stripQuery = (c: Choice) => {
    if ((c.analytics || c.marketing) && location.search) history.replaceState(history.state, "", location.pathname + location.hash);
  };

  // Apply a choice: load, update or stop the tags it allows.
  const apply = useCallback(
    (c: Choice) => {
      stripQuery(c);
      if ((trackers.ga || trackers.ads) && (c.analytics || c.marketing || (window as W).gtag)) setUpGoogle(trackers, c);
      setUpMeta(trackers, c);
    },
    [trackers],
  );

  useEffect(() => {
    const onChange = (e: Event) => {
      const c = (e as CustomEvent<Choice>).detail;
      setChoice(c);
      apply(c);
      applied.current = true;
      pageView(trackers, c);
    };
    window.addEventListener(CONSENT_CHANGE, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE, onChange);
  }, [apply, trackers]);

  // Every page view (first load and in-site navigation), once a choice exists. The tags are
  // set up once per page load; after that each navigation only reports the new page.
  useEffect(() => {
    const c = choiceRef.current;
    if (!c) return;
    if (!applied.current) {
      apply(c);
      applied.current = true;
    } else stripQuery(c);
    pageView(trackers, c);
  }, [pathname, apply, trackers]);

  // Conversions: a sent form (lib/analytics.ts events) and taps on any phone link.
  useEffect(() => {
    // Each sent form counts once, including one sent before this code finished loading.
    const handle = (entry: TrackedEvent | undefined) => {
      const c = choiceRef.current;
      if (!c || !entry || entry.handled || entry.event !== "contact_submit_success") return;
      entry.handled = true;
      conversion(trackers, c, "lead");
    };
    const onForm = (e: Event) => handle((e as CustomEvent<TrackedEvent>).detail);
    queuedEvents().forEach(handle);
    const onClick = (e: MouseEvent) => {
      const c = choiceRef.current;
      const a = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (c && a) conversion(trackers, c, "call");
    };
    window.addEventListener("dd:analytics", onForm);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("dd:analytics", onForm);
      document.removeEventListener("click", onClick, true);
    };
  }, [trackers]);

  const openSettings = useCallback((section?: string) => {
    const c = choiceRef.current;
    setAnalytics(c?.analytics ?? false);
    setMarketing(c?.marketing ?? false);
    dialog.current?.showModal();
    if (section === "marketing") requestAnimationFrame(() => marketingBox.current?.focus());
  }, []);

  useEffect(() => {
    const onOpen = () => {
      const pending = takePendingOpen();
      if (pending) openSettings(pending.section);
    };
    window.addEventListener(CONSENT_OPEN, onOpen);
    onOpen(); // a click that happened before this code loaded
    return () => window.removeEventListener(CONSENT_OPEN, onOpen);
  }, [openSettings]);

  const save = (a: boolean, m: boolean) => {
    writeConsent({ analytics: showAnalytics && a, marketing: showMarketing && m });
    dialog.current?.close();
  };

  const categories = [showAnalytics && "statistics", showMarketing && "advertising"].filter(Boolean).join(" and ");

  return (
    <>
      {!choice && (
        <section aria-labelledby="cookie-banner-title" className="cookie-banner">
          <div className="mx-auto flex w-full max-w-site flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
            <div className="max-w-[62ch]">
              <h2 id="cookie-banner-title" className="text-[17px] font-bold text-text">
                Cookies on this site
              </h2>
              <p className="mt-1 text-[15px] text-muted">
                We&apos;d like to use {categories} cookies to see how the site is used and whether our ads help people find
                us. They stay off unless you turn them on. Nothing you type in the contact form is ever shared with them.{" "}
                <a href="/privacy/#cookies" className="link-secondary">
                  Privacy notice
                </a>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button type="button" className="btn-secondary btn-compact" onClick={() => save(true, true)}>
                Accept all
              </button>
              <button type="button" className="btn-secondary btn-compact" onClick={() => save(false, false)}>
                Reject non-essential
              </button>
              <button type="button" className="btn-secondary btn-compact" onClick={() => openSettings()}>
                Manage choices
              </button>
            </div>
          </div>
        </section>
      )}

      <dialog ref={dialog} aria-labelledby="cookie-settings-title" className="cookie-dialog">
        <form
          method="dialog"
          onSubmit={(e) => {
            e.preventDefault();
            save(analytics, marketing);
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 id="cookie-settings-title" className="h3">
              Cookie settings
            </h2>
            <button type="button" className="cookie-close" aria-label="Close without changing" onClick={() => dialog.current?.close()}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <p className="mt-2 text-[15px] text-muted">
            Choose which cookies to allow. We don&apos;t sell your personal information, and nothing you type in the contact
            form is shared with these services.
          </p>
          <div className="mt-5 flex flex-col gap-4">
            <div className="cookie-option">
              <p className="font-semibold text-text">Necessary</p>
              <p className="text-[15px] text-muted">Remembers these choices (cookie: {"dd_consent"}, 6 months). Always on.</p>
            </div>
            {showAnalytics && (
              <label className="cookie-option cookie-toggle">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                <span>
                  <span className="block font-semibold text-text">Statistics</span>
                  <span className="block text-[15px] text-muted">
                    Google Analytics counts visits and which pages are useful. Cookies: _ga, _ga_*, up to 2 years.
                  </span>
                </span>
              </label>
            )}
            {showMarketing && (
              <label className="cookie-option cookie-toggle">
                <input
                  ref={marketingBox}
                  type="checkbox"
                  checked={marketing && !gpc}
                  disabled={gpc}
                  aria-describedby={gpc ? "cookie-gpc-note" : undefined}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                <span>
                  <span className="block font-semibold text-text">Advertising</span>
                  <span className="block text-[15px] text-muted">
                    {[trackers.ads && "Google Ads", trackers.meta && "Meta (Facebook and Instagram)"].filter(Boolean).join(" and ")}{" "}
                    measure whether our ads led to a call or a message. Cookies:{" "}
                    {[trackers.ads && "_gcl_*", trackers.meta && "_fbp, _fbc"].filter(Boolean).join(", ")}, up to 90 days.
                    Turning this off is your &ldquo;Do Not Sell or Share&rdquo; choice.
                  </span>
                </span>
              </label>
            )}
            {gpc && (
              <p id="cookie-gpc-note" className="text-[15px] text-text">
                Your browser sent a Global Privacy Control signal, so advertising cookies stay off.
              </p>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button type="button" className="btn-secondary btn-compact" onClick={() => save(true, true)}>
              Accept all
            </button>
            <button type="button" className="btn-secondary btn-compact" onClick={() => save(false, false)}>
              Reject non-essential
            </button>
            <button type="submit" className="btn-secondary btn-compact">
              Save choices
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
