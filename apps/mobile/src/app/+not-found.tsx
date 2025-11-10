import { View } from "react-native";

import { Trans, useTranslation } from "@turbostarter/i18n";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { Link } from "~/modules/common/styled";

export default function NotFound() {
  const { t } = useTranslation("common");

  return (
    <View className="bg-background flex flex-1 items-center justify-center px-6">
      <View className="items-center gap-6 text-center">
        <Text className="font-sans-bold mt-4 text-4xl">
          {t("error.notFound")}
        </Text>
        <Text className="text-center text-lg text-pretty">
          <Trans
            i18nKey="editToReload"
            ns="marketing"
            values={{ file: "src/app/+not-found.tsx" }}
            components={{
              code: <Text className="bg-muted rounded-sm px-1.5 font-mono" />,
            }}
          />
        </Text>
        <Link
          href={pathsConfig.index}
          replace
          className="text-primary mt-6 inline-block font-sans underline underline-offset-4 hover:no-underline"
        >
          {t("goBackHome")}
        </Link>
      </View>
    </View>
  );
}
