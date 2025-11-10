import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { memo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider as AnalyticsProvider } from "@turbostarter/analytics-mobile";

import { I18nProvider } from "~/lib/providers/i18n";
import { ThemeProvider } from "~/lib/providers/theme";
import { QueryClientProvider } from "~/lib/query";
import { Verification } from "~/modules/auth/verification";

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface ProvidersProps {
  readonly children: React.ReactNode;
}

export const Providers = memo<ProvidersProps>(({ children }) => {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider>
        <I18nProvider>
          <SafeAreaProvider>
            <ThemeProvider>
              <KeyboardProvider>
                <BottomSheetModalProvider>
                  <AnalyticsProvider>
                    {children}
                    <Verification />
                    <PortalHost />
                  </AnalyticsProvider>
                </BottomSheetModalProvider>
              </KeyboardProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </I18nProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
});

Providers.displayName = "Providers";
