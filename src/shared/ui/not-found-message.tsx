import * as stylex from "@stylexjs/stylex";
import { colors } from "./tokens.stylex";

type Props = {
  title: string;
  description: string;
};

// Shared by the localized not-found page and the global one, which cannot use
// translations and passes plain English.
export function NotFoundMessage({ title, description }: Props) {
  return (
    <div {...stylex.props(styles.root)}>
      <h1 {...stylex.props(styles.title)}>{title}</h1>
      <p {...stylex.props(styles.description)}>{description}</p>
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingInline: 24,
    textAlign: "center",
    backgroundColor: colors.canvas,
  },
  title: {
    fontSize: "1.875rem",
    lineHeight: "2.25rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    color: colors.heading,
  },
  description: {
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
    color: colors.body,
  },
});
