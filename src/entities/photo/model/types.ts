export type Photo = {
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
  photos: Photo[];
};
