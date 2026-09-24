"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA_LABEL } from "@/lib/site";

const FIELD = "input, select, textarea";

// Opaque mobile intake bar. Hidden on /intake, while the page's own hero CTA is
// on screen, and whenever a form field has focus (so it never sits over the keyboard).
export function StickyCta() {
  const pathname = usePathname();
  const [fieldFocused, setFieldFocused] = useState(false);
  const [heroCtaVisible, setHeroCtaVisible] = useState(false);
  const hidden = pathname === "/intake" || fieldFocused || heroCtaVisible;

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
      setHeroCtaVisible(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setHeroCtaVisible(entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const mobile = window.matchMedia("(max-width: 1023px)");
    // Reserve space for the bar whenever it can appear, so it never covers the page end.
    const reserve = pathname !== "/intake";
    const apply = () =>
      root.style.setProperty("--sticky-cta-height", reserve && mobile.matches ? "calc(84px + env(safe-area-inset-bottom))" : "0px");
    apply();
    mobile.addEventListener("change", apply);
    return () => mobile.removeEventListener("change", apply);
  }, [pathname]);

  if (hidden) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/40 bg-bg px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 lg:hidden">
      <Link href="/intake" className="btn-primary w-full">
        {CTA_LABEL}
      </Link>
    </div>
  );
}
