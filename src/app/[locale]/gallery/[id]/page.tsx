import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { gallery, getPhoto } from "@/data/gallery";

// Every photo page is prerendered at build time; anything else is a 404.
export const dynamicParams = false;

// The parent `[locale]` segment runs this once per locale, so returning the
// ids alone yields locales × photos prerendered pages.
export function generateStaticParams() {
  return gallery.photos.map((photo) => ({ id: photo.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gallery/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const photo = getPhoto(id);

  if (!photo || !hasLocale(routing.locales, locale)) {
    return {};
  }

  return {
    title: photo.prompt,
    description: photo.alt,
    openGraph: { images: [{ url: photo.url, width: photo.width, height: photo.height }] },
  };
}

export default async function PhotoPage({
  params,
}: PageProps<"/[locale]/gallery/[id]">) {
  const { locale, id } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const photo = getPhoto(id);

  if (!photo) {
    notFound();
  }

  const t = await getTranslations("PhotoPage");
  const format = await getFormatter();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-1 flex-col gap-8 bg-white px-16 py-24 dark:bg-black">
        <Link
          href="/gallery"
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          {t("backToGallery")}
        </Link>

        {/* Photos are hotlinked to the provider CDN, as their terms require. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="w-full rounded-lg"
          style={{ backgroundColor: photo.color }}
        />

        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            {photo.prompt}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {photo.alt}
          </h1>
        </div>

        <dl className="flex flex-col divide-y divide-black/[.08] dark:divide-white/[.145]">
          <div className="flex justify-between gap-8 py-3">
            <dt className="text-zinc-500">{t("dimensions")}</dt>
            <dd className="font-mono text-black dark:text-zinc-50">
              {format.number(photo.width)} × {format.number(photo.height)}
            </dd>
          </div>
          <div className="flex justify-between gap-8 py-3">
            <dt className="text-zinc-500">{t("color")}</dt>
            <dd className="flex items-center gap-2 font-mono text-black dark:text-zinc-50">
              <span
                aria-hidden
                className="size-4 rounded border border-black/[.08] dark:border-white/[.145]"
                style={{ backgroundColor: photo.color }}
              />
              {photo.color}
            </dd>
          </div>
          <div className="flex justify-between gap-8 py-3">
            <dt className="text-zinc-500">{t("photographer")}</dt>
            <dd>
              {/* Pexels asks for a visible credit linking to the photographer. */}
              <a
                href={photo.credit.link}
                target="_blank"
                rel="noreferrer"
                className="text-black underline underline-offset-4 dark:text-zinc-50"
              >
                {photo.credit.name}
              </a>
            </dd>
          </div>
          <div className="flex justify-between gap-8 py-3">
            <dt className="text-zinc-500">{t("source")}</dt>
            <dd>
              <a
                href={photo.credit.photoLink}
                target="_blank"
                rel="noreferrer"
                className="text-black underline underline-offset-4 dark:text-zinc-50"
              >
                {t("viewOnPexels")}
              </a>
            </dd>
          </div>
        </dl>
      </main>
    </div>
  );
}
