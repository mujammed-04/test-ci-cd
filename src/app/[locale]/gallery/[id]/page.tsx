import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { gallery, getPhoto } from "@/data/gallery";
import { colors, fonts } from "@/styles/tokens.stylex";

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
    <div {...stylex.props(styles.canvas)}>
      <main {...stylex.props(styles.main)}>
        <Link href="/gallery" {...stylex.props(styles.back)}>
          {t("backToGallery")}
        </Link>

        {/* Photos are hotlinked to the provider CDN, as their terms require. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          {...stylex.props(styles.photo, styles.tint(photo.color))}
        />

        <div {...stylex.props(styles.heading)}>
          <span {...stylex.props(styles.prompt)}>{photo.prompt}</span>
          <h1 {...stylex.props(styles.title)}>{photo.alt}</h1>
        </div>

        <dl {...stylex.props(styles.details)}>
          <div {...stylex.props(styles.row)}>
            <dt {...stylex.props(styles.label)}>{t("dimensions")}</dt>
            <dd {...stylex.props(styles.value, styles.mono)}>
              {format.number(photo.width)} × {format.number(photo.height)}
            </dd>
          </div>
          <div {...stylex.props(styles.row)}>
            <dt {...stylex.props(styles.label)}>{t("color")}</dt>
            <dd {...stylex.props(styles.value, styles.mono, styles.swatchRow)}>
              <span aria-hidden {...stylex.props(styles.swatch, styles.tint(photo.color))} />
              {photo.color}
            </dd>
          </div>
          <div {...stylex.props(styles.row)}>
            <dt {...stylex.props(styles.label)}>{t("photographer")}</dt>
            <dd>
              {/* Pexels asks for a visible credit linking to the photographer. */}
              <a
                href={photo.credit.link}
                target="_blank"
                rel="noreferrer"
                {...stylex.props(styles.value, styles.link)}
              >
                {photo.credit.name}
              </a>
            </dd>
          </div>
          <div {...stylex.props(styles.row)}>
            <dt {...stylex.props(styles.label)}>{t("source")}</dt>
            <dd>
              <a
                href={photo.credit.photoLink}
                target="_blank"
                rel="noreferrer"
                {...stylex.props(styles.value, styles.link)}
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

const styles = stylex.create({
  canvas: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colors.canvas,
    fontFamily: fonts.sans,
  },
  main: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    gap: 32,
    width: "100%",
    maxWidth: "56rem",
    paddingInline: 64,
    paddingBlock: 96,
    backgroundColor: colors.surface,
  },
  back: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 500,
    color: {
      default: colors.body,
      ":hover": colors.heading,
    },
    transitionProperty: "color",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  photo: {
    width: "100%",
    borderRadius: 8,
  },
  // The provider's average colour: a placeholder behind the image and the swatch.
  tint: (color: string) => ({
    backgroundColor: color,
  }),
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  prompt: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: colors.muted,
  },
  title: {
    fontSize: "1.875rem",
    lineHeight: "2.25rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    color: colors.heading,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  // Stands in for Tailwind's divide-y: a hairline above every row but the first.
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 32,
    paddingBlock: 12,
    borderTopWidth: {
      default: 1,
      ":first-child": 0,
    },
    borderTopStyle: "solid",
    borderTopColor: colors.hairline,
  },
  label: {
    color: colors.muted,
  },
  value: {
    color: colors.heading,
  },
  mono: {
    fontFamily: fonts.mono,
  },
  swatchRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.hairline,
  },
  link: {
    textDecorationLine: "underline",
    textUnderlineOffset: 4,
  },
});
