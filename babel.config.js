const path = require("path");

const dev = process.env.NODE_ENV !== "production";

// Turbopack picks this file up automatically (Next 16+) and runs it in
// addition to its own SWC transforms. It exists solely for StyleX.
module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev,
        runtimeInjection: false,
        enableInlinedConditionalMerge: true,
        treeshakeCompensation: true,
        aliases: { "@/*": [path.join(__dirname, "src/*")] },
        unstable_moduleResolution: { type: "commonJS", rootDir: __dirname },
      },
    ],
  ],
};
