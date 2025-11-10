"use client";

import { Provider } from "@turbostarter/analytics-web";

export const AnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Provider>{children}</Provider>;
};
