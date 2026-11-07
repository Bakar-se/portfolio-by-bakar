import { loadPhoto } from "@/lib/share-card";
import { ImageResponse } from "next/og";

// The home-screen icon on iOS, generated from Bakar's photo. iOS rounds the
// corners itself, so the photo fills the square.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const photo = await loadPhoto();
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt="" width={180} height={180} />
    ),
    size,
  );
}
