import { memo } from "react";
import { FlatList, View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { cn, ThemeColor, ThemeMode } from "@turbostarter/ui";

import { Button } from "./button";
import { Icons } from "./icons";
import { Label } from "./label";
import { Text } from "./text";

import type { ThemeConfig } from "@turbostarter/ui";

interface ThemeCustomizerProps {
  readonly config: ThemeConfig;
  readonly onChange: (config: ThemeConfig) => Promise<void>;
}

export const MODE_ICONS = {
  [ThemeMode.LIGHT]: Icons.Sun,
  [ThemeMode.DARK]: Icons.Moon,
  [ThemeMode.SYSTEM]: Icons.SunMoon,
} as const;

export const ThemeCustomizer = memo<ThemeCustomizerProps>(
  ({ config, onChange }) => {
    const { t } = useTranslation("common");
    return (
      <View className="mt-2 flex-1 items-center gap-4">
        <View className="w-full gap-1.5">
          <Label nativeID="color" className="text-xs">
            {t("theme.color.label")}
          </Label>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            data={Object.values(ThemeColor).filter((color) =>
              Object.values(ThemeColor).includes(color),
            )}
            columnWrapperClassName="gap-2"
            contentContainerClassName="gap-2"
            renderItem={({ item }) => {
              return (
                <Button
                  variant="outline"
                  size="sm"
                  key={item}
                  onPress={() => onChange({ ...config, color: item })}
                  hitSlop={2}
                  className={cn(
                    "h-11 grow basis-[100px] flex-row justify-start gap-3 px-3",
                    config.color === item && "border-primary border-2",
                    `theme-${item}`,
                  )}
                >
                  <View
                    className={cn(
                      "bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    )}
                  />
                  <Text className="text-sm capitalize">
                    {t(`theme.color.${item}`)}
                  </Text>
                </Button>
              );
            }}
          />
        </View>
        <View className="w-full gap-1.5">
          <Label nativeID="mode" className="text-xs">
            {t("theme.mode.label")}
          </Label>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            data={Object.values(ThemeMode)}
            columnWrapperClassName="gap-2"
            contentContainerClassName="gap-2"
            renderItem={({ item }) => {
              const isActive = config.mode === item;
              const Icon = MODE_ICONS[item];

              return (
                <Button
                  variant="outline"
                  size="sm"
                  key={item}
                  onPress={() => onChange({ ...config, mode: item })}
                  hitSlop={2}
                  className={cn(
                    "h-11 grow basis-[100px] flex-row justify-start gap-2 capitalize",
                    isActive && "border-primary border-2",
                  )}
                >
                  <Icon
                    className="text-foreground shrink-0"
                    width={20}
                    height={20}
                  />
                  <Text className="text-sm capitalize">
                    {t(`theme.mode.${item}`)}
                  </Text>
                </Button>
              );
            }}
          />
        </View>
      </View>
    );
  },
);

ThemeCustomizer.displayName = "ThemeCustomizer";
