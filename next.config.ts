import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/shared/config/i18n/request.ts",
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // The root layout lives under `app/[locale]`, so a global 404 for
    // unmatched routes can't be composed from `layout.js` + `not-found.js`.
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
