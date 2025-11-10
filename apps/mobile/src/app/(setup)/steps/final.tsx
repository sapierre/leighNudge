import { router } from "expo-router";
import { View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import { Text } from "@turbostarter/ui-mobile/text";

import { useSetupSteps } from "~/app/(setup)/steps/_layout";
import { pathsConfig } from "~/config/paths";
import { ScrollView } from "~/modules/common/styled";

export default function FinalStep() {
  const { t } = useTranslation(["common", "marketing"]);
  const { goNext } = useSetupSteps();

  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        className="pt-4"
      >
        <View className="items-start gap-1">
          <Text className="font-sans-bold text-3xl tracking-tight">
            {t("setup.steps.step.final.title")}
          </Text>
          <Text className="text-muted-foreground text-lg leading-snug">
            {t("setup.steps.step.final.description")}
          </Text>
        </View>
      </ScrollView>

      <Button
        className="mt-auto"
        size="lg"
        onPress={() => {
          goNext();
          router.replace(pathsConfig.dashboard.user.index);
        }}
      >
        <Text>{t("finish")}</Text>
      </Button>
    </>
  );
}
