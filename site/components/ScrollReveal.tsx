"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SCROLL_REVEALS } from "@/lib/site-basics";

// Gentle scroll reveals (plans/scroll-reveals-plan.md). Marked blocks ([data-reveal]) rise
// 12 px into place once as they come into view. Only at 768 px+, with motion allowed and
// JavaScript on; otherwise nothing is offset. Blocks already on screen at load are shown
// straight away without animating. Text is only moved, never faded.
const QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function Reveals() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(QUERY).matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));

    // First frame: reveal what's already visible with transitions off, so nothing moves on load.
    root.classList.add("reveal-instant");
    const fold = window.innerHeight * 0.9;
    for (const el of pending) {
      const r = el.getBoundingClientRect();
      if (r.top < fold && r.bottom > 0) el.classList.add("is-revealed");
    }
    root.classList.add("reveal-ready");
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => root.classList.remove("reveal-instant"));
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target); // once only
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of pending) if (!el.classList.contains("is-revealed")) io.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}

export function ScrollReveal() {
  return SCROLL_REVEALS ? <Reveals /> : null;
}
