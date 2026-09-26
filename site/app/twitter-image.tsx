import { renderShareCard, SHARE_CARD_SIZE, SHARE_CARD_TYPE } from "@/lib/share-card";
import { SHARE_ALT } from "@/lib/site";

// X (Twitter) copy of the default link-preview card for the home page and every page without its own.
export const alt = SHARE_ALT;
export const size = SHARE_CARD_SIZE;
export const contentType = SHARE_CARD_TYPE;

export default function Image() {
  return renderShareCard({});
}
