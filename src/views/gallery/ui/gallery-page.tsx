import * as stylex from "@stylexjs/stylex";
import { getTranslations } from "next-intl/server";
import { gallery } from "@/entities/photo";
import { PageShell } from "@/shared/ui";
import { colors } from "@/shared/ui/tokens.stylex";
import { PhotoGrid } from "@/widgets/photo-grid";

export async function GalleryPage() {
  const t = await getTranslations("GalleryPage");
  const { photos, generatedAt } = gallery;

  return (
    <PageShell width="wide">
      <div {...stylex.props(styles.heading)}>
        <h1 {...stylex.props(styles.title)}>{t("title")}</h1>
        <p {...stylex.props(styles.count)}>{t("count", { count: photos.length })}</p>
      </div>
      <PhotoGrid photos={photos} generatedAt={generatedAt} />
    </PageShell>
  );
}

const styles = stylex.create({
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
});
