import { View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import { Text } from "@turbostarter/ui-mobile/text";

import { useSetupSteps } from "~/app/(setup)/steps/_layout";
import { ScrollView } from "~/modules/common/styled";

export default function SkipStep() {
  const { t } = useTranslation(["common", "marketing"]);
  const { goNext } = useSetupSteps();

  return (
    <>
      <ScrollView
        className="pt-4"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-start gap-1">
          <Text className="font-sans-bold text-3xl tracking-tight">
            {t("setup.steps.step.skip.title")}
          </Text>
          <Text className="text-muted-foreground text-lg leading-snug">
            {t("setup.steps.step.skip.description")}
          </Text>
        </View>
      </ScrollView>
      <View className="mt-auto gap-2">
        <Button size="lg" onPress={() => goNext()} variant="ghost">
          <Text>{t("skip")}</Text>
        </Button>
        <Button size="lg" onPress={() => goNext()}>
          <Text>{t("continue")}</Text>
        </Button>
      </View>
    </>
  );
}
