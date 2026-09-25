"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PRACTICES } from "@/lib/site";
import { PracticeIcon } from "./PracticeIcon";

// Every practice area in a sideways-scrolling row, under the three featured cards on the
// home page. Adding an area to PRACTICES in lib/site.ts adds a card here. It is a plain
// scroll-snap list, so it works by swipe, trackpad or keyboard even before JavaScript
// loads; the arrow buttons only scroll it. No autoplay.
export function PracticeCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const frame = requestAnimationFrame(measure);
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const move = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "inline-flex size-11 items-center justify-center rounded-full border border-border/70 bg-surface text-text transition-colors hover:border-action disabled:cursor-default disabled:opacity-40 disabled:hover:border-border/70";

  return (
    <section aria-labelledby="all-practice-title" aria-roledescription="carousel" data-reveal="" className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 id="all-practice-title" className="h3">
            All practice areas
          </h3>
          <p className="mt-1 text-[16px] text-muted">
            {PRACTICES.length} areas. Swipe or use the arrows to see them all.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className={arrow} onClick={() => move(-1)} disabled={edges.start} aria-label="Previous practice areas">
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.75} />
          </button>
          <button type="button" className={arrow} onClick={() => move(1)} disabled={edges.end} aria-label="Next practice areas">
            <ChevronRight aria-hidden="true" size={22} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-4 pt-1 [scrollbar-width:thin] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {PRACTICES.map((p, i) => (
          <li
            key={p.slug}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${PRACTICES.length}: ${p.title}`}
            className="card flex w-[82%] shrink-0 snap-start flex-col gap-3 p-6 sm:w-[46%] lg:w-[calc((100%-3rem)/3)]"
          >
            <PracticeIcon name={p.icon} size={32} />
            <h4 className="text-[20px] font-bold leading-tight">{p.title}</h4>
            <p className="text-[16px] text-muted">{p.summary}</p>
            <Link
              href={`/practice-areas/${p.slug}/`}
              className="card-link link-secondary mt-auto inline-flex min-h-11 items-center gap-2 font-semibold"
            >
              Learn more<span className="sr-only"> about {p.title}</span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
