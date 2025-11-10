import { defineEnv } from "envin";
import * as z from "zod";

import { preset as analytics } from "@turbostarter/analytics-mobile/env";
import { envConfig } from "@turbostarter/shared/constants";
import { ThemeColor, ThemeMode } from "@turbostarter/ui";

const castStringToBool = z.preprocess((val) => {
  if (typeof val === "string") {
    if (["1", "true"].includes(val.toLowerCase())) return true;
    if (["0", "false"].includes(val.toLowerCase())) return false;
  }
  return val;
}, z.coerce.boolean());

export default defineEnv({
  ...envConfig,
  extends: [analytics],
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_AUTH_PASSWORD: castStringToBool.optional().default(true),
    EXPO_PUBLIC_AUTH_MAGIC_LINK: castStringToBool.optional().default(false),
    EXPO_PUBLIC_AUTH_ANONYMOUS: castStringToBool.optional().default(true),
    EXPO_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional().default(""),

    EXPO_PUBLIC_SITE_URL: z.url(),
    EXPO_PUBLIC_DEFAULT_LOCALE: z.string().optional().default("en"),
    EXPO_PUBLIC_THEME_MODE: z
      .enum(ThemeMode)
      .optional()
      .default(ThemeMode.SYSTEM),
    EXPO_PUBLIC_THEME_COLOR: z
      .enum(ThemeColor)
      .optional()
      .default(ThemeColor.ORANGE),
  },
  env: {
    ...process.env,
    EXPO_PUBLIC_SITE_URL: process.env.EXPO_PUBLIC_SITE_URL,
    EXPO_PUBLIC_DEFAULT_LOCALE: process.env.EXPO_PUBLIC_DEFAULT_LOCALE,
    EXPO_PUBLIC_THEME_MODE: process.env.EXPO_PUBLIC_THEME_MODE,
    EXPO_PUBLIC_THEME_COLOR: process.env.EXPO_PUBLIC_THEME_COLOR,

    EXPO_PUBLIC_AUTH_PASSWORD: process.env.EXPO_PUBLIC_AUTH_PASSWORD,
    EXPO_PUBLIC_AUTH_MAGIC_LINK: process.env.EXPO_PUBLIC_AUTH_MAGIC_LINK,
    EXPO_PUBLIC_AUTH_ANONYMOUS: process.env.EXPO_PUBLIC_AUTH_ANONYMOUS,
    EXPO_PUBLIC_GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,

    EXPO_PUBLIC_POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  },
});
