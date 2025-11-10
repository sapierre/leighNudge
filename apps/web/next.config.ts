import type { NextConfig } from "next";

import env from "./env.config";

const INTERNAL_PACKAGES = [
  "@turbostarter/analytics-web",
  "@turbostarter/api",
  "@turbostarter/auth",
  "@turbostarter/billing",
  "@turbostarter/cms",
  "@turbostarter/email",
  "@turbostarter/db",
  "@turbostarter/i18n",
  "@turbostarter/shared",
  "@turbostarter/storage",
  "@turbostarter/ui",
  "@turbostarter/ui-web",
];

const config: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
    ],
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: INTERNAL_PACKAGES,
  experimental: {
    optimizePackageImports: INTERNAL_PACKAGES,
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: env.ANALYZE,
});

export default withBundleAnalyzer(config);
