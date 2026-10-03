// The practice-area icons, drawn for this site (plans/practice-icons-plan.md, 3 Oct 2026).
// Same 24-unit grid, 1.5 stroke and round ends as the lucide icons used everywhere else, so the
// site keeps one icon family. Each icon has one cyan detail (class "accent", coloured in
// globals.css with --color-action). Decorative only: the card's title says what it is.
import type { ReactNode } from "react";

const PATHS = {
  // First-Time Offenders: a sunrise, "a fresh start".
  sunrise: (
    <>
      <path d="M12 5v3" />
      <path d="m4.5 9.5 1.6 1.6" />
      <path d="m19.5 9.5-1.6 1.6" />
      <path d="M3 17h18" />
      <path d="M8 21h8" />
      <path className="accent" d="M6 17a6 6 0 0 1 12 0" />
    </>
  ),
  // Criminal Defense: a hanging balance. Drawn unlike lucide's "scale" (straight beam, ring, pans
  // on cords), which the site uses for the DUI Court board seat.
  scales: (
    <>
      <circle cx="12" cy="4.5" r="1.25" />
      <path d="M12 5.75V20" />
      <path d="M8 20h8" />
      <path d="M5.5 8h13" />
      <path d="M5.5 8v5M18.5 8v5" />
      <path className="accent" d="M2.5 13h6a3 3 0 0 1-6 0ZM15.5 13h6a3 3 0 0 1-6 0Z" />
    </>
  ),
  // DUI/DWI: a parked car, front view; the headlights are the accent.
  car: (
    <>
      <path d="M5 10l1.5-3.8A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.2L19 10" />
      <rect x="3" y="10" width="18" height="7" rx="2" />
      <path d="M6 17v2M18 17v2" />
      <path className="accent" d="M6.5 13h2M15.5 13h2" />
    </>
  ),
  // Domestic Assault: a house (not a badge-like shield); the door is the accent.
  home: (
    <>
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path className="accent" d="M9.5 21v-4.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V21" />
    </>
  ),
  // Expungement: a record with a "reset" arrow.
  record: (
    <>
      <path d="M8.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9l5 5v2.5" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 9h2" />
      <path className="accent" d="M11.5 17a4.5 4.5 0 1 0 4.5-4.5 4.88 4.88 0 0 0-3.37 1.37L11.5 15M11.5 12.5V15H14" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type PracticeIconName = keyof typeof PATHS;

// Tile and icon sizes in px (plan section 5): cards, the home carousel, the practice-page link list.
const SIZES = { lg: [56, 32], md: [48, 28], sm: [40, 22] } as const;

export function PracticeIcon({ name, size = "lg" }: { name: PracticeIconName; size?: keyof typeof SIZES }) {
  const [tile, icon] = SIZES[size];
  return (
    <span className="practice-icon" style={{ width: tile, height: tile }}>
      <svg
        viewBox="0 0 24 24"
        width={icon}
        height={icon}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        data-icon={name}
      >
        {PATHS[name]}
      </svg>
    </span>
  );
}
