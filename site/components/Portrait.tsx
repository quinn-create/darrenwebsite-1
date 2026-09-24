import Image from "next/image";
import portrait from "@/public/images/darren-drake-signal-4x5.jpg";
import square from "@/public/images/darren-drake-signal-square.jpg";

// Darren's portrait (Signal version, pending his written approval of the edited background).
// Crops are cut by scripts/make-photo-crops.py from the genuine middle strip only.
// Never replace with a generated image, and never place text over it.
export const PORTRAIT_ALT = "Darren Drake, attorney at law";

export function Portrait({
  priority = false,
  glow = false,
  sizes,
  className = "",
}: {
  priority?: boolean;
  glow?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {glow && <div aria-hidden="true" className="portrait-glow" />}
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
