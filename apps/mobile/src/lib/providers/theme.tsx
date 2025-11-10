import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { memo } from "react";
import { StatusBar, View } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { cn } from "@turbostarter/ui";

import { appConfig } from "~/config/app";
import { useTheme } from "~/modules/common/hooks/use-theme";
import { isAndroid } from "~/utils/device";

import type { ThemeConfig } from "@turbostarter/ui";

export const useThemeConfig = create<{
  config: Omit<ThemeConfig, "mode">;
  setConfig: (config: Omit<ThemeConfig, "mode">) => void;
}>()(
  persist(
    (set) => ({
      config: appConfig.theme,
      setConfig: (config) => set({ config }),
    }),
    {
      name: "theme-config",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

export const ThemeProvider = memo<ThemeProviderProps>(({ children }) => {
  const { isDark } = useTheme();
  const config = useThemeConfig((state) => state.config);

  if (isAndroid) {
    void NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark");
  }

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View
        className={cn("will-change-container flex-1", {
          dark: isDark,
        })}
      >
        <View className={cn("bg-background flex-1", `theme-${config.color}`)}>
          {children}
        </View>
      </View>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
    </NavigationThemeProvider>
  );
});

ThemeProvider.displayName = "ThemeProvider";
