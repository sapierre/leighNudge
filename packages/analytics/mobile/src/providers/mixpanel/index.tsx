import { Mixpanel } from "mixpanel-react-native";
import { useEffect } from "react";

import { useTrackingPermissions } from "../../hooks";

import { env } from "./env";

import type { AnalyticsProviderStrategy } from "../types";

const optOutTracking = true;
const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(
  env.EXPO_PUBLIC_MIXPANEL_TOKEN,
  trackAutomaticEvents,
  optOutTracking,
);

void mixpanel.init();

const Provider: AnalyticsProviderStrategy["Provider"] = ({ children }) => {
  const granted = useTrackingPermissions();

  useEffect(() => {
    void (async () => {
      const optedOut = await mixpanel.hasOptedOutTracking();
      if (granted && optedOut) {
        void mixpanel.optInTracking();
      }
    })();
  }, [granted]);

  return <>{children}</>;
};

const track: AnalyticsProviderStrategy["track"] = (name, params) => {
  mixpanel.track(name, params);
};

export { track, Provider };
