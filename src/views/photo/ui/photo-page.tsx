import { notFound } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { getTranslations } from "next-intl/server";
import { getPhoto } from "@/entities/photo";
import { Link } from "@/shared/config";
import { PageShell } from "@/shared/ui";
import { colors, fonts } from "@/shared/ui/tokens.stylex";
import { PhotoDetails } from "./photo-details";

type Props = {
  id: string;
};

export async function PhotoPage({ id }: Props) {
  const photo = getPhoto(id);

  if (!photo) {
    notFound();
  }

  const t = await getTranslations("PhotoPage");

  return (
    <PageShell width="regular">
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

      <PhotoDetails photo={photo} />
    </PageShell>
  );
}

const styles = stylex.create({
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
  // The provider's average colour shows behind the image while it loads.
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
});
