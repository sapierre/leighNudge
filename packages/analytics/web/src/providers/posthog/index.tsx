"use client";

import dynamic from "next/dynamic";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { env } from "./env";

import type { AnalyticsProviderClientStrategy } from "../types";

const PageView = dynamic(
  () => import("./page-view").then((mod) => mod.PageView),
  {
    ssr: false,
  },
);

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "always",
    capture_pageview: false,
  });
}

const Provider: AnalyticsProviderClientStrategy["Provider"] = ({
  children,
}) => {
  return (
    <PostHogProvider client={posthog}>
      {children}
      <PageView />
    </PostHogProvider>
  );
};

const track: AnalyticsProviderClientStrategy["track"] = (event, properties) => {
  if (typeof window === "undefined") {
    return;
  }

  posthog.capture(event, properties);
};

export { Provider, track };
