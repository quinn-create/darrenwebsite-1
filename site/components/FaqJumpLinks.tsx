"use client";

import type { MouseEvent } from "react";

// "Jump to" buttons above a grouped FAQ list. They are plain in-page links, so without
// JavaScript they still scroll to the group; with it, the click also opens the group's
// first question and moves keyboard focus onto it.
export function FaqJumpLinks({ groups }: { groups: { id: string; label: string }[] }) {
  function onClick(e: MouseEvent<HTMLAnchorElement>, id: string) {
    const group = document.getElementById(id);
    if (!group) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    group.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
    const first = group.querySelector("details");
    if (first) {
      first.open = true;
      first.querySelector("summary")?.focus({ preventScroll: true });
    }
  }

  return (
    <nav aria-label="Jump to a FAQ topic" className="mt-6">
      <ul className="flex flex-wrap gap-3">
        {groups.map((g) => (
          <li key={g.id}>
            <a href={`#${g.id}`} className="chip chip-link" onClick={(e) => onClick(e, g.id)}>
              {g.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
