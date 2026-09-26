import Image from "next/image";
import { PORTRAIT_1X1 as square, PORTRAIT_4X5 as portrait } from "@/lib/portrait";

// Darren's portrait (approved for all uses on 24 Sep 2026, D2; PORTRAIT_VARIANT picks the version).
// Crops are cut by scripts/make-portrait-crops.mjs from the genuine middle strip only.
// Never replace with a generated image, and never place text over it.
export const PORTRAIT_ALT = "Darren Drake, attorney at law";

export function Portrait({
  priority = false,
  glow = false,
  sizes,
  className = "",
}: {
  priority?: boolean;
  // true: the home hero's glow (fades in once on desktop); "still": the same glow, never animated (About).
  glow?: boolean | "still";
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {glow && <div aria-hidden="true" className="portrait-glow" data-still={glow === "still" || undefined} />}
      <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-card border border-border bg-surface">
        <Image
          src={portrait}
          alt={PORTRAIT_ALT}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
          placeholder="blur"
        />
      </div>
    </div>
  );
}

// Small round photo for cards, placed next to Darren's name, so screen readers skip it.
export function PortraitAvatar({ size = 96 }: { size?: 64 | 96 }) {
  return (
    <Image
      src={square}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className="shrink-0 rounded-full border border-border object-cover"
    />
  );
}
