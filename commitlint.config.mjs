/** @see https://www.conventionalcommits.org/en/v1.0.0/ */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // types allowed in the subject line
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
  },
};
