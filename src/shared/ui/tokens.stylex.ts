import * as stylex from "@stylexjs/stylex";

const DARK = "@media (prefers-color-scheme: dark)";

// Colours carry their own dark-mode value, so components reference one token
// and never spell out the media query themselves.
export const colors = stylex.defineVars({
  // Page chrome: the outer canvas and the <main> surface.
  canvas: { default: "#fafafa", [DARK]: "#000000" },
  surface: { default: "#ffffff", [DARK]: "#000000" },
  // Text.
  heading: { default: "#000000", [DARK]: "#fafafa" },
  body: { default: "#52525b", [DARK]: "#a1a1aa" },
  muted: "#71717a",
  strong: { default: "#09090b", [DARK]: "#fafafa" },
  // Primary button: inverted foreground/background.
  buttonFill: { default: "#171717", [DARK]: "#ededed" },
  buttonText: { default: "#ffffff", [DARK]: "#0a0a0a" },
  buttonHover: { default: "#383838", [DARK]: "#cccccc" },
  // Hairlines and tinted fills.
  hairline: { default: "rgba(0, 0, 0, 0.08)", [DARK]: "rgba(255, 255, 255, 0.145)" },
  hoverFill: { default: "rgba(0, 0, 0, 0.04)", [DARK]: "#1a1a1a" },
  codeFill: { default: "rgba(0, 0, 0, 0.06)", [DARK]: "rgba(255, 255, 255, 0.08)" },
  // Monochrome logos flip in dark mode.
  logoFilter: { default: "none", [DARK]: "invert(1)" },
});

export const fonts = stylex.defineVars({
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
});

export const breakpoints = stylex.defineConsts({
  sm: "@media (min-width: 40rem)",
  md: "@media (min-width: 48rem)",
});
