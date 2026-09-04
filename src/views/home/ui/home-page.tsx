import Image from "next/image";
import * as stylex from "@stylexjs/stylex";
import { useTranslations } from "next-intl";
import { PageShell } from "@/shared/ui";
import { breakpoints, colors, fonts } from "@/shared/ui/tokens.stylex";
import { SiteHeader } from "@/widgets/site-header";

export function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <PageShell width="narrow" main={styles.main}>
      <SiteHeader />
      <div {...stylex.props(styles.intro)}>
        <h1 {...stylex.props(styles.title)}>
          {t.rich("title", {
            code: (chunks) => <code {...stylex.props(styles.code)}>{chunks}</code>,
          })}
        </h1>
        <p {...stylex.props(styles.description)}>
          {t.rich("description", {
            templates: (chunks) => (
              <a
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                {...stylex.props(styles.inlineLink)}
              >
                {chunks}
              </a>
            ),
            learn: (chunks) => (
              <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                {...stylex.props(styles.inlineLink)}
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
      <div {...stylex.props(styles.actions)}>
        <a
          {...stylex.props(styles.button, styles.primaryButton)}
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            {...stylex.props(styles.vercelLogo)}
            src="/vercel.svg"
            alt="Vercel logomark"
            width={16}
            height={14}
          />
          {t("deploy")}
        </a>
        <a
          {...stylex.props(styles.button, styles.secondaryButton)}
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("docs")}
        </a>
      </div>
    </PageShell>
  );
}

const styles = stylex.create({
  main: {
    alignItems: {
      default: "center",
      [breakpoints.sm]: "flex-start",
    },
    justifyContent: "space-between",
    gap: 0,
    paddingBlock: 128,
  },
  vercelLogo: {
    height: 14,
    width: 16,
    filter: colors.logoFilter,
  },
  intro: {
    display: "flex",
    flexDirection: "column",
    alignItems: {
      default: "center",
      [breakpoints.sm]: "flex-start",
    },
    gap: 24,
    textAlign: {
      default: "center",
      [breakpoints.sm]: "left",
    },
  },
  title: {
    maxWidth: "20rem",
    fontSize: "1.875rem",
    lineHeight: "2.5rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    color: colors.heading,
  },
  code: {
    borderRadius: 4,
    backgroundColor: colors.codeFill,
    paddingInline: 6,
    paddingBlock: 2,
    fontFamily: fonts.mono,
    fontSize: "0.9em",
  },
  description: {
    maxWidth: "28rem",
    fontSize: "1.125rem",
    lineHeight: "2rem",
    color: colors.body,
  },
  inlineLink: {
    fontWeight: 500,
    color: colors.strong,
  },
  actions: {
    display: "flex",
    flexDirection: {
      default: "column",
      [breakpoints.sm]: "row",
    },
    gap: 16,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    fontWeight: 500,
  },
  button: {
    display: "flex",
    height: 48,
    width: {
      default: "100%",
      [breakpoints.md]: 158,
    },
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 9999,
    paddingInline: 20,
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  primaryButton: {
    backgroundColor: {
      default: colors.buttonFill,
      ":hover": colors.buttonHover,
    },
    color: colors.buttonText,
  },
  secondaryButton: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: colors.hairline,
      ":hover": "transparent",
    },
    backgroundColor: {
      default: "transparent",
      ":hover": colors.hoverFill,
    },
  },
});
