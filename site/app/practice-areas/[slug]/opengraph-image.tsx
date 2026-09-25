import { renderShareCard, SHARE_CARD_SIZE } from "@/lib/share-card";
import { PRACTICES } from "@/lib/site";

// Link-preview card for one practice area, e.g. "DUI/DWI" above Darren's name.
// generateImageMetadata gives each practice its own alt text (a fixed `alt` export can't).
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const practice = PRACTICES.find((p) => p.slug === params.slug);
  return [
    {
      id: "card",
      size: SHARE_CARD_SIZE,
      contentType: "image/png",
      alt: `${practice?.title ?? "Practice area"}: Darren Drake, Attorney at Law, Murfreesboro, Tennessee.`,
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = PRACTICES.find((p) => p.slug === slug);
  return renderShareCard({ label: practice?.title });
}
