import { renderShareCard, SHARE_CARD_SIZE } from "@/lib/share-card";
import { SHARE_ALT } from "@/lib/site";

// Default link-preview card for the home page and every page without its own.
export const alt = SHARE_ALT;
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderShareCard({});
}
