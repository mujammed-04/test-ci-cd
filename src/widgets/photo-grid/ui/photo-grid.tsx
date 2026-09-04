import * as stylex from "@stylexjs/stylex";
import { getFormatter, getTranslations } from "next-intl/server";
import { PhotoCard, type Photo } from "@/entities/photo";
import { breakpoints, colors } from "@/shared/ui/tokens.stylex";

type Props = {
  photos: Photo[];
  /** ISO timestamp of the last gallery refresh. */
  generatedAt: string;
};

export async function PhotoGrid({ photos, generatedAt }: Props) {
  const t = await getTranslations("PhotoGrid");
  const format = await getFormatter();

  if (photos.length === 0) {
    return <p {...stylex.props(styles.muted)}>{t("empty")}</p>;
  }

  return (
    <>
      <ul {...stylex.props(styles.grid)}>
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
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
  );
}

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      [breakpoints.sm]: "repeat(2, minmax(0, 1fr))",
    },
    gap: 32,
  },
  muted: {
    color: colors.muted,
  },
  small: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
});
