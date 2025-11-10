import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { useTranslation } from "@turbostarter/i18n";
import { cn } from "@turbostarter/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@turbostarter/ui-mobile/avatar";
import { useBottomSheet } from "@turbostarter/ui-mobile/bottom-sheet";
import { Button } from "@turbostarter/ui-mobile/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@turbostarter/ui-mobile/dropdown-menu";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Skeleton } from "@turbostarter/ui-mobile/skeleton";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";
import { useCustomer } from "~/modules/billing/hooks/use-customer";
import { Spinner } from "~/modules/common/spinner";
import { organization } from "~/modules/organization/lib/api";

import { CreateOrganizationBottomSheet } from "./create-organization";

export const AccountSwitcher = () => {
  const { t } = useTranslation(["common", "auth", "organization"]);
  const [open, setOpen] = useState(false);

  const session = authClient.useSession();
  const organizations = authClient.useListOrganizations();
  const activeOrganization = authClient.useActiveOrganization();
  const activeMember = authClient.useActiveMember();
  const customer = useCustomer();

  const createOrganizationBottomSheet = useBottomSheet();
  const setActiveOrganization = useMutation({
    ...organization.mutations.setActive,
    onSuccess: (_, variables) => {
      activeOrganization.refetch();
      activeMember.refetch();
      if (variables?.organizationId || variables?.organizationSlug) {
        router.replace(pathsConfig.dashboard.organization.index);
      } else {
        router.replace(pathsConfig.dashboard.user.index);
      }
    },
  });

  return (
    <>
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn("h-14 w-full flex-row items-center gap-3 px-2", {
              "bg-accent": open,
            })}
          >
            <Avatar
              alt={
                activeOrganization.data?.name ?? session.data?.user.name ?? ""
              }
            >
              {activeOrganization.data ? (
                <>
                  <AvatarImage
                    source={{ uri: activeOrganization.data.logo ?? undefined }}
                  />
                  <AvatarFallback>
                    <Text className="text-muted-foreground text-sm">
                      {activeOrganization.data.name.charAt(0).toUpperCase()}
                    </Text>
                  </AvatarFallback>
                </>
              ) : (
                <>
                  <AvatarImage
                    source={{ uri: session.data?.user.image ?? undefined }}
                  />
                  <AvatarFallback>
                    <Icons.UserRound
                      size={20}
                      className="text-muted-foreground"
                    />
                  </AvatarFallback>
                </>
              )}
            </Avatar>

            <View className="flex-1">
              <Text
                className="font-sans-medium native:leading-tight"
                numberOfLines={1}
              >
                {activeOrganization.data
                  ? activeOrganization.data.name
                  : t("account.personal")}
              </Text>
              {customer.isPending ? (
                <Skeleton className="mt-1.5 h-3 w-20" />
              ) : (
                <Text
                  className={cn(
                    "text-muted-foreground native:leading-tight font-sans text-sm capitalize",
                    {
                      "text-accent-foreground": open,
                    },
                  )}
                >
                  {(customer.data?.plan ?? "free").toLowerCase()}
                </Text>
              )}
            </View>

            <Icons.ChevronsUpDown
              width={16}
              height={16}
              className="text-muted-foreground ml-4"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={4}>
          <DropdownMenuItem
            onPress={() =>
              setActiveOrganization.mutate({ organizationId: null })
            }
          >
            <Avatar alt={session.data?.user.name ?? ""} className="size-7">
              <AvatarImage
                source={{ uri: session.data?.user.image ?? undefined }}
              />
              <AvatarFallback>
                <Icons.UserRound size={14} className="text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <Text>{t("account.personal")}</Text>

            {!activeOrganization.data ? (
              <Icons.Check
                className="text-muted-foreground ml-auto"
                size={16}
              />
            ) : (
              <View className="size-4" />
            )}
          </DropdownMenuItem>
          {!!organizations.data?.length && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground tracking-tight">{`${t("organizations")} (${organizations.data.length})`}</DropdownMenuLabel>
                {organizations.data.map((organization) => (
                  <DropdownMenuItem
                    key={organization.id}
                    onPress={() =>
                      setActiveOrganization.mutate({
                        organizationId: organization.id,
                      })
                    }
                  >
                    <Avatar className="size-7" alt={organization.name}>
                      <AvatarImage
                        source={{ uri: organization.logo ?? undefined }}
                      />
                      <AvatarFallback>
                        <Text className="text-muted-foreground text-sm">
                          {organization.name.charAt(0).toUpperCase()}
                        </Text>
                      </AvatarFallback>
                    </Avatar>
                    <Text numberOfLines={1}>{organization.name}</Text>

                    {activeOrganization.data?.id === organization.id ? (
                      <Icons.Check
                        className="text-muted-foreground ml-auto"
                        size={16}
                      />
                    ) : (
                      <View className="size-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onPress={createOrganizationBottomSheet.open}>
            <View className="border-border flex size-7 items-center justify-center rounded-md border bg-transparent">
              <Icons.Plus size={16} className="text-muted-foreground" />
            </View>
            <Text>{t("create.cta")}</Text>
            <View className="size-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationBottomSheet ref={createOrganizationBottomSheet.ref} />
      {setActiveOrganization.isPending && <Spinner />}
    </>
  );
};
