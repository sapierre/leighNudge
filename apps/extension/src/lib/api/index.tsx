import { hc } from "hono/client";

import { appConfig } from "~/config/app";

import type { AppRouter } from "@turbostarter/api";

export const getBaseUrl = () => {
  return appConfig.url;
};

export const { api } = hc<AppRouter>(getBaseUrl(), {
  headers: {
    "x-client-platform": "extension",
  },
});
