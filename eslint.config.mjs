import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylex from "@stylexjs/eslint-plugin";
import boundaries from "eslint-plugin-boundaries";

// Feature-Sliced Design layers, highest first. A layer may import only from
// the layers below it. `views` is FSD's `pages` layer, renamed because Next.js
// refuses a `src/pages` folder next to the root `app` router.
const LAYERS = ["app", "views", "widgets", "features", "entities", "shared"];
const SLICED = ["views", "widgets", "features", "entities"];
const below = (layer) => LAYERS.slice(LAYERS.indexOf(layer) + 1);

// A slice is reachable from outside only through its index.ts. shared/ui also
// exposes the StyleX token file: StyleX resolves defineVars only via a direct
// import of the .stylex.ts file.
const PUBLIC_API = ["index.ts"];
const SHARED_PUBLIC_API = ["index.ts", "*.stylex.ts"];

const via = (types, entry) => ({
  to: { element: { types: { anyOf: types }, fileInternalPath: entry } },
});

const fsd = {
  files: ["src/**/*.{ts,tsx}", "app/**/*.{ts,tsx}"],
  plugins: { boundaries },
  settings: {
    "import/resolver": {
      typescript: { project: "./tsconfig.json" },
      node: true,
    },
    "boundaries/elements": [
      // Next.js route files: thin adapters that only compose the app and views layers.
      { type: "routes", pattern: "app", partialMatch: false },
      { type: "app", pattern: "src/app", partialMatch: false },
      { type: "views", pattern: "src/views/*", capture: ["slice"], partialMatch: false },
      { type: "widgets", pattern: "src/widgets/*", capture: ["slice"], partialMatch: false },
      { type: "features", pattern: "src/features/*", capture: ["slice"], partialMatch: false },
      { type: "entities", pattern: "src/entities/*", capture: ["slice"], partialMatch: false },
      { type: "shared", pattern: "src/shared/*", capture: ["segment"], partialMatch: false },
    ],
  },
  rules: {
    // One rule carries both constraints: the layer order and the public API.
    // Anything not explicitly allowed here is rejected, which also rules out
    // imports between slices of the same layer.
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        message:
          "FSD: {{from.type}} may not import {{to.type}}/{{to.internalPath}}. Layers import downward only, slices of one layer never import each other, and another slice is reachable only through its index.ts.",
        policies: [
          {
            from: { element: { type: "routes" } },
            allow: [via(["app", "views"], PUBLIC_API), via(["shared"], SHARED_PUBLIC_API)],
          },
          {
            from: { element: { type: "app" } },
            allow: [via(SLICED, PUBLIC_API), via(["shared"], SHARED_PUBLIC_API)],
          },
          ...SLICED.map((layer) => ({
            from: { element: { type: layer } },
            allow: [
              via(below(layer).filter((l) => l !== "shared"), PUBLIC_API),
              via(["shared"], SHARED_PUBLIC_API),
            ],
          })),
          {
            from: { element: { type: "shared" } },
            allow: via(["shared"], SHARED_PUBLIC_API),
          },
        ],
      },
    ],
    // Every source file must belong to a layer, and every local import must
    // resolve to a file that belongs to one.
    "boundaries/no-unknown-files": "error",
    "boundaries/no-unknown-dependencies": "error",
    "boundaries/no-ignored-dependencies": "error",
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}", "app/**/*.{ts,tsx}"],
    plugins: { "@stylexjs": stylex },
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/no-unused": "error",
      "@stylexjs/valid-shorthands": "warn",
    },
  },
  fsd,
  // Babel and PostCSS configs must be CommonJS so Next's Babel detection and
  // the PostCSS plugin can share one file.
  {
    files: ["babel.config.js", "postcss.config.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
