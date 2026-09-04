import type { Gallery, Photo } from "../model/types";
import galleryJson from "./gallery.json";

// gallery.json is rewritten hourly by scripts/generate-gallery.mjs and the
// gallery workflow; nothing else should touch it.
export const gallery = galleryJson as Gallery;

const byId = new Map(gallery.photos.map((photo) => [photo.id, photo]));

export function getPhoto(id: string): Photo | undefined {
  return byId.get(id);
}
