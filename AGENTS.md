<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Styling: StyleX, not Tailwind

This project was migrated from Tailwind CSS to StyleX (`@stylexjs/stylex`). Do not add Tailwind classes, `className` strings, or a Tailwind config back.

- Write styles with `stylex.create()` at the bottom of the component file and apply them with `{...stylex.props(styles.a, cond && styles.b)}`. Later arguments win per property.
- Colours, fonts and breakpoints come from `src/styles/tokens.stylex.ts`. Colour tokens already carry their dark-mode value, so components must not write `@media (prefers-color-scheme: dark)` themselves. Use `breakpoints.sm` / `breakpoints.md` as keys for responsive values.
- `defineVars` / `defineConsts` may only live in `*.stylex.ts` files with named exports and nothing else exported.
- StyleX forbids descendant, child and sibling selectors. Only pseudo-classes, pseudo-elements and at-rules on the element itself. Prefer longhands over multi-value shorthands (`paddingInline`, `borderTopWidth`, not `padding: "0 16px"`).
- Values that come from data (for example a photo's placeholder colour) are dynamic styles: a function inside `stylex.create()`.
- `babel.config.js` and `postcss.config.js` are CommonJS on purpose: Turbopack detects the Babel file automatically and the PostCSS plugin reuses the same plugin list. `src/app/globals.css` holds a small reset and the `@stylex;` directive that the compiled CSS replaces.
- Lint enforces `@stylexjs/valid-styles` and `@stylexjs/no-unused`; run `yarn lint` and `yarn build` before pushing style changes.
