import * as stylex from "@stylexjs/stylex";
import { getTranslations } from "next-intl/server";
import { Link } from "@/shared/config";
import { colors, fonts } from "@/shared/ui/tokens.stylex";
import type { Photo } from "../model/types";

type Props = {
  photo: Photo;
};

export async function PhotoCard({ photo }: Props) {
  const t = await getTranslations("PhotoCard");

  return (
    <li {...stylex.props(styles.card)}>
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
  );
}

const styles = stylex.create({
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
