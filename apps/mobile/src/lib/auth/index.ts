import * as SecureStore from "expo-secure-store";

import { createClient } from "@turbostarter/auth/client/mobile";
import { config } from "@turbostarter/i18n";

import { getBaseUrl } from "~/lib/api/utils";
import { useI18nConfig } from "~/lib/providers/i18n";

export const authClient = createClient({
  baseURL: getBaseUrl(),
  disableDefaultFetchPlugins: true,
  mobile: {
    storage: SecureStore,
    cookiePrefix: "turbostarter",
  },
  fetchOptions: {
    headers: {
      Cookie: `${config.cookie}=${useI18nConfig.getState().config.locale}`,
      "x-client-platform": "mobile",
    },
    throw: true,
  },
});
