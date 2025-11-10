import { useState } from "react";

import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import { Icons } from "@turbostarter/ui-mobile/icons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@turbostarter/ui-mobile/tabs";
import { Text } from "@turbostarter/ui-mobile/text";

import { authClient } from "~/lib/auth";
import { SafeAreaView } from "~/modules/common/styled";
import { InvitationsList } from "~/modules/organization/invitations/list/invitations-list";
import { toMemberRole } from "~/modules/organization/lib/utils";
import { InviteMemberBottomSheet } from "~/modules/organization/members/invite-member";
import { MembersList } from "~/modules/organization/members/list/members-list";

export default function Members() {
  const { t } = useTranslation(["common", "organization"]);
  const [tab, setTab] = useState("members");

  const activeMember = authClient.useActiveMember();

  const hasInvitePermission = authClient.organization.checkRolePermission({
    permission: {
      invitation: ["create"],
    },
    role: toMemberRole(activeMember.data?.role),
  });

  return (
    <SafeAreaView
      className="bg-background flex-1 gap-4 p-6"
      edges={["top", "left", "right"]}
    >
      <Tabs value={tab} onValueChange={setTab} className="flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="members" className="grow">
            <Text>{t("members.title")}</Text>
          </TabsTrigger>
          <TabsTrigger value="invitations" className="grow">
            <Text>{t("invitations.title")}</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="flex-1">
          <MembersList />
        </TabsContent>
        <TabsContent value="invitations" className="flex-1">
          <InvitationsList />
        </TabsContent>
      </Tabs>

      <InviteMemberBottomSheet>
        <Button disabled={!hasInvitePermission}>
          <Icons.UserRoundPlus size={18} className="text-primary-foreground" />
          <Text>{t("invite")}</Text>
        </Button>
      </InviteMemberBottomSheet>
    </SafeAreaView>
  );
}
