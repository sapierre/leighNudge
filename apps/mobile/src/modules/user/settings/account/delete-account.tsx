import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { SettingsTile } from "~/modules/common/settings-tile";
import { Spinner } from "~/modules/common/spinner";
import { user } from "~/modules/user/lib/api";

export const DeleteAccount = () => {
  const { t } = useTranslation(["common", "auth"]);
  const deleteUser = useMutation({
    ...user.mutations.delete,
    onSuccess: () => {
      Alert.alert(t("account.delete.confirmation.success"), undefined, [
        {
          onPress: () => {
            router.back();
          },
        },
      ]);
    },
  });

  return (
    <>
      <SettingsTile
        destructive
        icon={Icons.Trash2}
        onPress={() => {
          Alert.alert(
            t("account.delete.title"),
            t("account.delete.disclaimer"),
            [
              {
                text: t("cancel"),
                style: "cancel",
              },
              {
                text: t("account.delete.confirmation.cta"),
                style: "destructive",
                onPress: () =>
                  deleteUser.mutate({
                    callbackURL: pathsConfig.index,
                  }),
              },
            ],
          );
        }}
      >
        <Text>{t("account.delete.title")}</Text>
      </SettingsTile>
      {deleteUser.isPending && <Spinner />}
    </>
  );
};
