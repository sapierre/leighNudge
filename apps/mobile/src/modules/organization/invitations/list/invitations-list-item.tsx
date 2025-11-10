import dayjs from "dayjs";
import { View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { cn } from "@turbostarter/ui";
import { Badge } from "@turbostarter/ui-mobile/badge";
import { Skeleton } from "@turbostarter/ui-mobile/skeleton";
import { Text } from "@turbostarter/ui-mobile/text";

import type { Invitation } from "@turbostarter/auth";

export const InvitationListItem = ({
  invitation,
}: {
  invitation: Invitation;
}) => {
  const { t, i18n } = useTranslation("common");
  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <View className="flex-1">
        <Text
          className="native:leading-tight font-sans-medium"
          numberOfLines={1}
          style={{ flexShrink: 1 }}
        >
          {invitation.email}
        </Text>
        <Text
          className={cn("text-muted-foreground text-sm", {
            "text-destructive": dayjs(invitation.expiresAt).isBefore(dayjs()),
          })}
          numberOfLines={1}
        >
          {t("expires")}{" "}
          {new Date(invitation.expiresAt).toLocaleString(i18n.language, {
            hour: "2-digit",
            minute: "2-digit",
            year: "numeric",
            month: "numeric",
            day: "2-digit",
          })}
        </Text>
      </View>
      <View className="ml-auto flex-row items-center gap-1">
        <Badge variant="secondary">
          <Text>{t(invitation.status)}</Text>
        </Badge>
        <Badge variant="outline">
          <Text>{t(invitation.role)}</Text>
        </Badge>
      </View>
    </View>
  );
};

export const InvitationListItemSkeleton = () => {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <View className="flex-1 gap-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-32" />
      </View>
      <View className="ml-auto flex-row items-center gap-1">
        <Skeleton className="h-5" style={{ width: 50 }} />
        <Skeleton className="h-5" style={{ width: 50 }} />
      </View>
    </View>
  );
};
