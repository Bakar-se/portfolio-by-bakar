import { loadPhoto } from "@/lib/share-card";
import { ImageResponse } from "next/og";

// The favicon, generated from Bakar's photo and cropped to a circle. One
// 192px icon (browsers scale it down for tabs) keeps it rendered at build
// time.

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default async function Icon() {
  const photo = await loadPhoto();
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt=""
        width={192}
        height={192}
        style={{ borderRadius: 9999 }}
      />
    ),
    size,
  );
}
