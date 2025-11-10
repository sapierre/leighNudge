import PostHog, { PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";

import { useTrackingPermissions } from "../../hooks";

import { env } from "./env";

import type { AnalyticsProviderStrategy } from "../types";

let client: PostHog | null = null;

const getClient = () => {
  if (client) {
    return client;
  }

  client = new PostHog(env.EXPO_PUBLIC_POSTHOG_KEY, {
    host: env.EXPO_PUBLIC_POSTHOG_HOST,
    defaultOptIn: false,
  });

  return client;
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = getClient();

  if (client.optedOut) {
    return children;
  }

  return (
    <PostHogProvider client={client} autocapture>
      {children}
    </PostHogProvider>
  );
};

const Setup = () => {
  const client = getClient();
  const granted = useTrackingPermissions();

  useEffect(() => {
    if (granted) {
      void client.optIn();
    } else {
      void client.optOut();
    }
  }, [granted, client]);

  return null;
};

const Provider: AnalyticsProviderStrategy["Provider"] = ({ children }) => {
  return (
    <Wrapper>
      <Setup />
      {children}
    </Wrapper>
  );
};

const track: AnalyticsProviderStrategy["track"] = (name, params) => {
  const client = getClient();

  if (client.optedOut) {
    return;
  }

  client.capture(name, params);
};

export { Provider, track };
