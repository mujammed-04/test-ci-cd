import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { GalleryPage } from "@/views/gallery";
import { routing } from "@/shared/config";

export default async function Page({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <GalleryPage />;
}
