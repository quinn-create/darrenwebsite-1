import { renderShareCard, SHARE_CARD_SIZE, SHARE_CARD_TYPE } from "@/lib/share-card";
import { PRACTICES, SHARE_ALT } from "@/lib/site";

// X (Twitter) copy of the practice-area link-preview card (see opengraph-image.tsx).
// generateImageMetadata gives each practice its own alt text (a fixed `alt` export can't).
export const size = SHARE_CARD_SIZE;
export const contentType = SHARE_CARD_TYPE;

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const practice = PRACTICES.find((p) => p.slug === params.slug);
  return [
    {
      id: "card",
      size: SHARE_CARD_SIZE,
      contentType: SHARE_CARD_TYPE,
      alt: `${practice?.title ?? "Practice area"}: ${SHARE_ALT}`,
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = PRACTICES.find((p) => p.slug === slug);
  return renderShareCard({ current: practice?.title });
}
