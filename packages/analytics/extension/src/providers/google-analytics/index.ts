import { env } from "./env";

import type {
  AllowedPropertyValues,
  AnalyticsProviderStrategy,
} from "../types";

const postEvent = async (
  event: string,
  data?: Record<string, AllowedPropertyValues>,
) => {
  const response = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID}&api_secret=${env.VITE_GOOGLE_ANALYTICS_SECRET}`,
    {
      method: "POST",
      body: JSON.stringify({
        client_id: data?.clientId ?? window.crypto.randomUUID(),
        events: [{ name: event, params: data }],
      }),
    },
  );

  if (!response.ok) {
    console.error("Failed to post event to Google Analytics: ", response);
  }
};

const track: AnalyticsProviderStrategy["track"] = (name, params) => {
  void postEvent(name, params);
};

export { track };
