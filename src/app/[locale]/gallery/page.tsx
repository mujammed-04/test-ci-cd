import { notFound } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { gallery } from "@/data/gallery";
import { breakpoints, colors, fonts } from "@/styles/tokens.stylex";

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
    <div {...stylex.props(styles.canvas)}>
      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.heading)}>
          <h1 {...stylex.props(styles.title)}>{t("title")}</h1>
          <p {...stylex.props(styles.count)}>{t("count", { count: photos.length })}</p>
        </div>

        {photos.length === 0 ? (
          <p {...stylex.props(styles.muted)}>{t("empty")}</p>
        ) : (
          <>
            <ul {...stylex.props(styles.grid)}>
              {photos.map((photo) => (
                <li key={photo.id} {...stylex.props(styles.card)}>
                  <Link href={`/gallery/${photo.id}`}>
                    {/* Photos are hotlinked to the provider CDN, as their terms require. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.thumb}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      {...stylex.props(styles.thumb, styles.tint(photo.color))}
                    />
                  </Link>
                  <div {...stylex.props(styles.caption)}>
                    <span {...stylex.props(styles.prompt)}>{photo.prompt}</span>
                    {/* Pexels asks for a visible credit linking to the photographer. */}
                    <span {...stylex.props(styles.credit)}>
                      {t.rich("credit", {
                        author: () => (
                          <a
                            href={photo.credit.link}
                            target="_blank"
                            rel="noreferrer"
                            {...stylex.props(styles.creditLink)}
                          >
                            {photo.credit.name}
                          </a>
                        ),
                        source: () => (
                          <a
                            href={photo.credit.photoLink}
                            target="_blank"
                            rel="noreferrer"
                            {...stylex.props(styles.creditLink)}
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

            <p {...stylex.props(styles.muted, styles.small)}>
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
    maxWidth: "64rem",
    paddingInline: 64,
    paddingBlock: 96,
    backgroundColor: colors.surface,
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: "2.25rem",
    lineHeight: "2.5rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    color: colors.heading,
  },
  count: {
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
    color: colors.body,
  },
  muted: {
    color: colors.muted,
  },
  small: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      [breakpoints.sm]: "repeat(2, minmax(0, 1fr))",
    },
    gap: 32,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  thumb: {
    aspectRatio: "3 / 2",
    width: "100%",
    borderRadius: 8,
    objectFit: "cover",
    transitionProperty: "opacity",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: {
      default: 1,
      ":hover": 0.9,
    },
  },
  // The provider's average colour shows while the image loads.
  tint: (color: string) => ({
    backgroundColor: color,
  }),
  caption: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  prompt: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: colors.muted,
  },
  credit: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    color: colors.body,
  },
  creditLink: {
    textDecorationLine: "underline",
    textUnderlineOffset: 4,
    color: {
      default: null,
      ":hover": colors.heading,
    },
  },
});
