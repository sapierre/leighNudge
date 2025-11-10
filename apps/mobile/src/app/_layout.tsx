import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  useFonts,
} from "@expo-google-fonts/geist";
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono";
import { Stack, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "~/assets/styles/globals.css";
import { authClient } from "~/lib/auth";
import "~/lib/polyfills";
import { Providers } from "~/lib/providers/providers";
import { useTheme } from "~/modules/common/hooks/use-theme";
import { Updates } from "~/modules/common/updates";

void SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

const RootNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(
    navigationRef as Parameters<typeof useReactNavigationDevTools>[0],
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200,
      }}
    />
  );
};

const useSetupAuth = () => {
  const session = authClient.useSession();
  const activeOrganization = authClient.useActiveOrganization();
  const activeMember = authClient.useActiveMember();

  if (session.isPending) {
    return false;
  }

  if (!session.data) {
    return true;
  }

  return !activeOrganization.isPending && !activeMember.isPending;
};

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    GeistMono_400Regular,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  const authLoaded = useSetupAuth();
  const { loaded: themeLoaded, setupTheme } = useTheme();

  const loaded = fontsLoaded && themeLoaded && authLoaded;

  useEffect(() => {
    void setupTheme();
  }, [setupTheme]);

  if (loaded) {
    SplashScreen.hide();
  }

  return <RootNavigator />;
};

export default function Root() {
  return (
    <Providers>
      <Updates />
      <RootLayout />
    </Providers>
  );
}
