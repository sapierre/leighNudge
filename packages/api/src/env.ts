import { defineEnv } from "envin";
import * as z from "zod";

import { preset as auth } from "@turbostarter/auth/env";
import { preset as billing } from "@turbostarter/billing/env";
import { preset as db } from "@turbostarter/db/env";
import { preset as email } from "@turbostarter/email/env";
import { envConfig } from "@turbostarter/shared/constants";
import { preset as storage } from "@turbostarter/storage/env";

import type { Preset } from "envin/types";

export const preset = {
  id: "api",
  server: {
    OPENAI_API_KEY: z.string().optional(), // change it to your provider API key (e.g. ANTHROPIC_API_KEY if you use Anthropic)
  },
  extends: [billing, auth, db, email, storage],
} as const satisfies Preset;

export const env = defineEnv({
  ...envConfig,
  ...preset,
});
