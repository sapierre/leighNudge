import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";
import { SettingsTile } from "~/modules/common/settings-tile";
import { Spinner } from "~/modules/common/spinner";
import { organization } from "~/modules/organization/lib/api";

export const LeaveOrganization = () => {
  const { t } = useTranslation(["common", "organization"]);
  const activeOrganization = authClient.useActiveOrganization();
  const listOrganizations = authClient.useListOrganizations();

  const { data: isOnlyOwner } = useQuery({
    ...organization.queries.members.getIsOnlyOwner({
      id: activeOrganization.data?.id ?? "",
    }),
    retry: false,
  });

  const leaveOrganization = useMutation({
    ...organization.mutations.leave,
    onSuccess: () => {
      activeOrganization.refetch();
      listOrganizations.refetch();
      router.replace(pathsConfig.dashboard.user.index);
    },
  });

  const canLeave = !isOnlyOwner?.status;

  if (!activeOrganization.data || !canLeave) {
    return null;
  }

  return (
    <>
      <SettingsTile
        icon={Icons.LogOut}
        destructive
        onPress={() => {
          Alert.alert(t("leave.title"), t("leave.disclaimer"), [
            { text: t("cancel"), style: "cancel" },
            {
              text: t("leave.cta"),
              style: "destructive",
              onPress: () => {
                leaveOrganization.mutate({
                  organizationId: activeOrganization.data?.id ?? "",
                });
              },
            },
          ]);
        }}
      >
        <Text>{t("leave.title")}</Text>
      </SettingsTile>
      {leaveOrganization.isPending && <Spinner />}
    </>
  );
};
