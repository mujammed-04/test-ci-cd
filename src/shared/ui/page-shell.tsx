import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, fonts } from "./tokens.stylex";

type Width = "narrow" | "regular" | "wide";

type Props = {
  width?: Width;
  /** Extra styles for the <main> element, merged after the defaults. */
  main?: stylex.StyleXStyles;
  children: ReactNode;
};

// The page frame every screen shares: a full-height canvas with a centred,
// width-limited <main> surface.
export function PageShell({ width = "regular", main, children }: Props) {
  return (
    <div {...stylex.props(styles.canvas)}>
      <main {...stylex.props(styles.main, widths[width], main)}>{children}</main>
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
    paddingInline: 64,
    paddingBlock: 96,
    backgroundColor: colors.surface,
  },
});

const widths = stylex.create({
  narrow: { maxWidth: "48rem" },
  regular: { maxWidth: "56rem" },
  wide: { maxWidth: "64rem" },
});
