"use client";

import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@turbostarter/ui-mobile/avatar";
import { Button } from "@turbostarter/ui-mobile/button";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Skeleton } from "@turbostarter/ui-mobile/skeleton";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";

import { CreateOrganizationBottomSheet } from "./create-organization";
import { organization } from "./lib/api";

export const OrganizationPicker = () => {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { t } = useTranslation("organization");

  const setActiveOrganization = useMutation({
    ...organization.mutations.setActive,
    onSuccess: () => {
      router.replace(pathsConfig.dashboard.organization.index);
    },
  });

  return (
    <View className="w-full gap-4">
      {isPending &&
        Array.from({ length: 2 }).map((_, index) => (
          <Skeleton style={{ height: 120 }} key={`skeleton-${index}`} />
        ))}

      {organizations?.map((organization) => (
        <Button
          variant="outline"
          key={organization.id}
          className="relative flex h-auto w-full items-center justify-between gap-3 px-6 py-4"
          onPress={() =>
            setActiveOrganization.mutate({
              organizationId: organization.id,
            })
          }
          disabled={setActiveOrganization.isPending}
        >
          <View className="w-full flex-row items-center justify-between gap-3">
            <View className="items-start gap-3">
              <Avatar alt="" style={{ width: 64, height: 64 }}>
                <AvatarImage source={{ uri: organization.logo ?? undefined }} />
                <AvatarFallback>
                  <Text className="text-muted-foreground text-2xl">
                    {organization.name.charAt(0).toUpperCase()}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <Text
                className="text-muted-foreground text-base"
                numberOfLines={1}
              >
                {organization.name}
              </Text>
            </View>

            <View className="mt-2 self-start">
              {setActiveOrganization.isPending &&
              setActiveOrganization.variables?.organizationId ===
                organization.id ? (
                <Spin>
                  <Icons.Loader2 className="text-muted-foreground" size={16} />
                </Spin>
              ) : (
                <Icons.ChevronRight
                  className="text-muted-foreground"
                  size={16}
                />
              )}
            </View>
          </View>
        </Button>
      ))}
      <CreateOrganizationBottomSheet>
        <Button
          disabled={setActiveOrganization.isPending}
          variant="outline"
          className="text-muted-foreground w-full flex-col gap-2 border-dashed"
          style={{ height: 120 }}
        >
          <Icons.Plus
            className="text-muted-foreground"
            strokeWidth={1.5}
            size={28}
          />
          <Text className="text-muted-foreground text-base">
            {t("create.cta")}
          </Text>
        </Button>
      </CreateOrganizationBottomSheet>
    </View>
  );
};
