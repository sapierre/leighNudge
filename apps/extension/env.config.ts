import { defineEnv } from "envin";
import * as z from "zod";

import { preset as analytics } from "@turbostarter/analytics-extension/env";
import { envConfig } from "@turbostarter/shared/constants";
import { ThemeColor, ThemeMode } from "@turbostarter/ui";

export default defineEnv({
  ...envConfig,
  extends: [analytics],
  clientPrefix: "VITE_",
  client: {
    VITE_PRODUCT_NAME: z.string(),
    VITE_SITE_URL: z.url(),
    VITE_DEFAULT_LOCALE: z.string().optional().default("en"),
    VITE_THEME_MODE: z.enum(ThemeMode).optional().default(ThemeMode.SYSTEM),
    VITE_THEME_COLOR: z.enum(ThemeColor).optional().default(ThemeColor.ORANGE),
  },
  env: {
    ...import.meta.env,
    VITE_PRODUCT_NAME: import.meta.env.VITE_PRODUCT_NAME,
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
    VITE_DEFAULT_LOCALE: import.meta.env.VITE_DEFAULT_LOCALE,
    VITE_THEME_MODE: import.meta.env.VITE_THEME_MODE,
    VITE_THEME_COLOR: import.meta.env.VITE_THEME_COLOR,

    VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
    VITE_POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
    VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID: import.meta.env
      .VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID,
    VITE_GOOGLE_ANALYTICS_SECRET: import.meta.env.VITE_GOOGLE_ANALYTICS_SECRET,
  },
  skip:
    (!!import.meta.env.SKIP_ENV_VALIDATION &&
      ["1", "true"].includes(import.meta.env.SKIP_ENV_VALIDATION)) ||
    ["postinstall", "lint"].includes(import.meta.env.npm_lifecycle_event),
});
