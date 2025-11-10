import { View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { Text } from "@turbostarter/ui-mobile/text";

export const AuthDivider = () => {
  const { t } = useTranslation("auth");

  return (
    <View className="relative w-full">
      <View className="absolute top-1/2 left-0 flex h-2 w-full items-center">
        <View className="border-input w-full border-t" />
      </View>
      <View className="bg-background relative justify-center self-center">
        <Text className="text-muted-foreground px-4 text-sm">
          {t("divider")}
        </Text>
      </View>
    </View>
  );
};
