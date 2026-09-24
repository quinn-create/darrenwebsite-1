"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { CTA_HREF, CTA_LABEL, PHONE_DISPLAY, PHONE_HREF, practiceBySlug } from "@/lib/site";

const FIELD = "input, select, textarea";

// Opaque mobile contact bar. Hidden on the Contact page (it holds the form), while the page's own hero CTA is
// on screen, and whenever a form field has focus (so it never sits over the keyboard).
// It stays hidden until the page has been measured, so slow phones never flash two buttons.
export function StickyCta() {
  const pathname = usePathname();
  const [fieldFocused, setFieldFocused] = useState(false);
  const onIntake = pathname.replace(/\/+$/, "") === "/contact";
  // Visibility of the current page's hero CTA, keyed by path so a stale value never carries over.
  const [heroCta, setHeroCta] = useState<{ path: string; visible: boolean } | null>(null);
  const measured = heroCta?.path === pathname;
  const heroCtaVisible = measured && heroCta.visible;
  const hidden = onIntake || fieldFocused || !measured || heroCtaVisible;

  useEffect(() => {
    const onIn = (e: FocusEvent) => setFieldFocused((e.target as Element | null)?.matches?.(FIELD) ?? false);
    const onOut = () => setFieldFocused(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  useEffect(() => {
    const target = document.querySelector("[data-hero-cta]");
    if (!target) {
      // No hero button on this page: show the bar after the first paint.
      const frame = requestAnimationFrame(() => setHeroCta({ path: pathname, visible: false }));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setHeroCta({ path: pathname, visible: entry.isIntersecting }));
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const mobile = window.matchMedia("(max-width: 1023px)");
    // Reserve space for the bar whenever it can appear, so it never covers the page end.
    const reserve = !onIntake;
    const apply = () =>
      root.style.setProperty("--sticky-cta-height", reserve && mobile.matches ? "calc(84px + env(safe-area-inset-bottom))" : "0px");
    apply();
    mobile.addEventListener("change", apply);
    return () => mobile.removeEventListener("change", apply);
  }, [onIntake]);

  if (hidden) return null;
  // On a practice page the bar names that area and opens the form with it filled in.
  const practice = practiceBySlug(pathname.match(/^\/practice-areas\/([^/]+)/)?.[1]);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-border/40 bg-bg px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 lg:hidden">
      <Link
        href={practice ? `${CTA_HREF}?topic=${practice.slug}` : CTA_HREF}
        className="btn-primary min-w-0 flex-1 px-4"
        // Long practice names wrap to two lines on narrow phones instead of being cut off.
        style={{ whiteSpace: "normal", lineHeight: 1.15, textAlign: "center" }}
      >
        <span>{practice ? `Ask about ${practice.title}` : CTA_LABEL}</span>
      </Link>
      <a
        href={PHONE_HREF}
        aria-label={`Call ${PHONE_DISPLAY}`}
        className="btn-secondary btn-icon"
      >
        <Phone aria-hidden="true" size={20} strokeWidth={2} />
      </a>
    </div>
  );
}
