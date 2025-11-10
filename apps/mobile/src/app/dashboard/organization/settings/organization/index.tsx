import { router } from "expo-router";
import { View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";
import { SettingsTile } from "~/modules/common/settings-tile";
import { toMemberRole } from "~/modules/organization/lib/utils";
import { DeleteOrganization } from "~/modules/organization/settings/delete-organization";
import { LeaveOrganization } from "~/modules/organization/settings/leave-organization";

export default function Organization() {
  const { t } = useTranslation("common");
  const { data: activeMember } = authClient.useActiveMember();

  const hasUpdatePermission = authClient.organization.checkRolePermission({
    permission: {
      organization: ["update"],
    },
    role: toMemberRole(activeMember?.role),
  });

  return (
    <View className="bg-background flex-1 gap-6 py-2">
      {hasUpdatePermission && (
        <SettingsTile
          icon={Icons.IdCard}
          onPress={() =>
            router.navigate(
              pathsConfig.dashboard.organization.settings.organization.name,
            )
          }
        >
          <Text>{t("name")}</Text>
        </SettingsTile>
      )}
      <LeaveOrganization />
      <DeleteOrganization />
    </View>
  );
}
