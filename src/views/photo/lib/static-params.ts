import { gallery } from "@/entities/photo";

// Every photo page is prerendered at build time. The parent `[locale]` segment
// runs this once per locale, so returning the ids alone yields
// locales × photos prerendered pages.
export function getPhotoStaticParams() {
  return gallery.photos.map((photo) => ({ id: photo.id }));
}
