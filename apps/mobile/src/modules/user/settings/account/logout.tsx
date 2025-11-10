import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Text } from "@turbostarter/ui-mobile/text";

import { useSetupSteps } from "~/app/(setup)/steps/_layout";
import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";
import { auth } from "~/modules/auth/lib/api";
import { SettingsTile } from "~/modules/common/settings-tile";
import { Spinner } from "~/modules/common/spinner";

export const Logout = () => {
  const { t } = useTranslation(["common", "auth"]);
  const { reset } = useSetupSteps();
  const { refetch } = authClient.useListOrganizations();

  const signOut = useMutation({
    ...auth.mutations.signOut,
    onSuccess: () => {
      reset();
      router.replace(pathsConfig.index);
      refetch();
    },
  });

  return (
    <>
      <SettingsTile
        icon={Icons.LogOut}
        onPress={() => {
          Alert.alert(t("logout.cta"), t("logout.confirm"), [
            {
              text: t("cancel"),
              style: "cancel",
            },
            {
              text: t("logout.cta"),
              style: "destructive",
              onPress: () => signOut.mutate(undefined),
            },
          ]);
        }}
      >
        <Text>{t("logout.cta")}</Text>
      </SettingsTile>
      {signOut.isPending && <Spinner />}
    </>
  );
};
