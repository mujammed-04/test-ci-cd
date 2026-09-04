"use client";

import { useTransition } from "react";
import * as stylex from "@stylexjs/stylex";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { colors } from "@/styles/tokens.stylex";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <label {...stylex.props(styles.root)}>
      <span {...stylex.props(styles.srOnly)}>{t("label")}</span>
      <select
        {...stylex.props(styles.select)}
        defaultValue={locale}
        disabled={isPending}
        onChange={(event) => {
          const nextLocale = event.target.value;
          startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
          });
        }}
      >
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {t("locale", { locale: cur })}
          </option>
        ))}
      </select>
      <span aria-hidden {...stylex.props(styles.chevron)}>
        ▾
      </span>
    </label>
  );
}

const styles = stylex.create({
  root: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
  },
  // Visually hidden but still read by screen readers.
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  select: {
    appearance: "none",
    borderRadius: 9999,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.hairline,
    backgroundColor: {
      default: "transparent",
      ":hover": colors.hoverFill,
    },
    paddingBlock: 6,
    paddingLeft: 12,
    paddingRight: 32,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 500,
    transitionProperty: "background-color, border-color",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
  },
  chevron: {
    pointerEvents: "none",
    position: "absolute",
    right: 12,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    opacity: 0.6,
  },
});
