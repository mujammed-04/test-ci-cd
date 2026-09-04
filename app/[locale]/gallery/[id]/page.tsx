import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getPhotoMetadata, getPhotoStaticParams, PhotoPage } from "@/views/photo";
import { routing } from "@/shared/config";

// Every photo page is prerendered at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPhotoStaticParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gallery/[id]">): Promise<Metadata> {
  const { locale, id } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  return getPhotoMetadata(id);
}

export default async function Page({ params }: PageProps<"/[locale]/gallery/[id]">) {
  const { locale, id } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <PhotoPage id={id} />;
}
