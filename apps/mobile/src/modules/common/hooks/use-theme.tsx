import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";

import { ThemeMode } from "@turbostarter/ui";

import { appConfig } from "~/config/app";

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const [loaded, setLoaded] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(colorScheme ?? ThemeMode.DARK);

  const setupTheme = useCallback(async () => {
    const storedTheme = await AsyncStorage.getItem("theme");

    if (storedTheme === ThemeMode.SYSTEM) {
      setTheme(storedTheme);
      setLoaded(true);
      return;
    }

    if (!storedTheme) {
      await AsyncStorage.setItem("theme", appConfig.theme.mode);
      setTheme(appConfig.theme.mode);
      setLoaded(true);
      return;
    }

    const colorTheme =
      storedTheme === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT;

    if (colorTheme !== colorScheme) {
      Appearance.setColorScheme(colorTheme);
      setTheme(colorTheme);
      setLoaded(true);
      return;
    }
    setLoaded(true);
  }, [colorScheme]);

  const changeTheme = useCallback(async (theme: ThemeMode) => {
    setTheme(theme);
    Appearance.setColorScheme(
      theme === ThemeMode.SYSTEM ? Appearance.getColorScheme() : theme,
    );
    await AsyncStorage.setItem("theme", theme);
  }, []);

  useEffect(() => {
    setTheme(colorScheme ?? ThemeMode.DARK);
  }, [colorScheme]);

  const isDark =
    theme === ThemeMode.DARK ||
    (theme === ThemeMode.SYSTEM && colorScheme === ThemeMode.DARK);

  const resolvedTheme = isDark ? ThemeMode.DARK : ThemeMode.LIGHT;

  return {
    setupTheme,
    changeTheme,
    loaded,
    theme,
    isDark,
    resolvedTheme,
  };
};
