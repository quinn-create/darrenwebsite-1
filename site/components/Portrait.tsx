import Image from "next/image";
import portrait from "@/public/images/darren-drake-portrait.jpg";

// Darren's genuine, approved portrait. Never replace with a generated image.
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
          alt="Darren Drake, attorney at law"
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-[50%_18%]"
          placeholder="blur"
        />
      </div>
    </div>
  );
}
