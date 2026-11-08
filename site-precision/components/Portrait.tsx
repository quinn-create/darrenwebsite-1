import Image from "next/image";
import portrait from "@/public/images/darren-drake-portrait.jpg";

// Darren's genuine, approved portrait. Never replace with a generated image.
export function Portrait({
  priority = false,
  caption = true,
  sizes,
  className = "",
}: {
  priority?: boolean;
  caption?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-border bg-surface">
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
      {caption && <figcaption className="mt-3 text-[15px] text-muted">Darren Drake — Attorney at Law</figcaption>}
    </figure>
  );
}
