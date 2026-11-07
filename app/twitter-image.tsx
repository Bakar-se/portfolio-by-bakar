import { SITE } from "@/lib/metadata";
import {
  SHARE_CARD_CONTENT_TYPE,
  SHARE_CARD_SIZE,
  siteShareCard,
} from "@/lib/share-card";

export const alt = `${SITE.name}, ${SITE.headline}`;
export const size = SHARE_CARD_SIZE;
export const contentType = SHARE_CARD_CONTENT_TYPE;

export default function Image() {
  return siteShareCard();
}
