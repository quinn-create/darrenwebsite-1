"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// The arrow buttons for PracticeCarousel. The list itself is rendered on the server (so its
// wording isn't in the browser's JavaScript); this finds it by id and only scrolls it.
export function CarouselArrows({ listId }: { listId: string }) {
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = document.getElementById(listId);
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, [listId]);

  useEffect(() => {
    const el = document.getElementById(listId);
    if (!el) return;
    const frame = requestAnimationFrame(measure);
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [listId, measure]);

  const move = (dir: -1 | 1) => {
    const el = document.getElementById(listId);
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "inline-flex size-11 items-center justify-center rounded-full border border-border/70 bg-surface text-text transition-colors hover:border-action disabled:cursor-default disabled:opacity-40 disabled:hover:border-border/70";

  return (
    <div className="flex shrink-0 gap-2">
      <button type="button" className={arrow} onClick={() => move(-1)} disabled={edges.start} aria-label="Previous practice areas">
        <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.75} />
      </button>
      <button type="button" className={arrow} onClick={() => move(1)} disabled={edges.end} aria-label="Next practice areas">
        <ChevronRight aria-hidden="true" size={22} strokeWidth={1.75} />
      </button>
    </div>
  );
}
