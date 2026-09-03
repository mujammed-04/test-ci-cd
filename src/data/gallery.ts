import galleryJson from "./gallery.json";

export type GalleryPhoto = {
  prompt: string;
  id: string;
  url: string;
  thumb: string;
  width: number;
  height: number;
  color: string;
  alt: string;
  credit: { name: string; link: string; photoLink: string };
};

export type Gallery = {
  generatedAt: string;
  photos: GalleryPhoto[];
};

export const gallery = galleryJson as Gallery;

const byId = new Map(gallery.photos.map((photo) => [photo.id, photo]));

export function getPhoto(id: string): GalleryPhoto | undefined {
  return byId.get(id);
}
