import type { Metadata } from "next";
import { getPhoto } from "@/entities/photo";

export function getPhotoMetadata(id: string): Metadata {
  const photo = getPhoto(id);

  if (!photo) {
    return {};
  }

  return {
    title: photo.prompt,
    description: photo.alt,
    openGraph: { images: [{ url: photo.url, width: photo.width, height: photo.height }] },
  };
}
