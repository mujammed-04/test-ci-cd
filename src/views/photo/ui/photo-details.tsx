import * as stylex from "@stylexjs/stylex";
import { getFormatter, getTranslations } from "next-intl/server";
import type { Photo } from "@/entities/photo";
import { colors, fonts } from "@/shared/ui/tokens.stylex";

type Props = {
  photo: Photo;
};

export async function PhotoDetails({ photo }: Props) {
  const t = await getTranslations("PhotoPage");
  const format = await getFormatter();

  return (
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
  );
}

const styles = stylex.create({
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
  tint: (color: string) => ({
    backgroundColor: color,
  }),
  link: {
    textDecorationLine: "underline",
    textUnderlineOffset: 4,
  },
});
