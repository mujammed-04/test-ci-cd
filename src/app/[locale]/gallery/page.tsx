import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { gallery } from "@/data/gallery";

export default async function GalleryPage({
  params,
}: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("GalleryPage");
  const format = await getFormatter();
  const { photos, generatedAt } = gallery;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-8 bg-white px-16 py-24 dark:bg-black">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t("count", { count: photos.length })}
          </p>
        </div>

        {photos.length === 0 ? (
          <p className="text-zinc-500">{t("empty")}</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {photos.map((photo) => (
                <li key={photo.id} className="flex flex-col gap-3">
                  <Link href={`/gallery/${photo.id}`}>
                    {/* Photos are hotlinked to the provider CDN, as their terms require. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.thumb}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      className="aspect-[3/2] w-full rounded-lg object-cover transition-opacity hover:opacity-90"
                      style={{ backgroundColor: photo.color }}
                    />
                  </Link>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      {photo.prompt}
                    </span>
                    {/* Pexels asks for a visible credit linking to the photographer. */}
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t.rich("credit", {
                        author: () => (
                          <a
                            href={photo.credit.link}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-4 hover:text-black dark:hover:text-zinc-50"
                          >
                            {photo.credit.name}
                          </a>
                        ),
                        source: () => (
                          <a
                            href={photo.credit.photoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-4 hover:text-black dark:hover:text-zinc-50"
                          >
                            Pexels
                          </a>
                        ),
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-sm text-zinc-500">
              {t("updated", {
                date: format.dateTime(new Date(generatedAt), {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              })}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
