import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { View } from "react-native";
import { useNativeVariable } from "react-native-css/native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";

import { useTranslation } from "@turbostarter/i18n";
import { pickBy } from "@turbostarter/shared/utils";
import { cn } from "@turbostarter/ui";
import { Text } from "@turbostarter/ui-mobile/text";

import { authClient } from "~/lib/auth";
import { organization } from "~/modules/organization/lib/api";

import { InvitationsListFilters } from "./invitations-list-filters";
import {
  InvitationListItem,
  InvitationListItemSkeleton,
} from "./invitations-list-item";

export const InvitationsList = () => {
  const { t } = useTranslation(["common", "organization"]);
  const primaryColor = useNativeVariable("--primary") as string;

  const activeOrganization = authClient.useActiveOrganization();
  const [filters, setFilters] = useState<
    Record<string, string | string[] | null>
  >({});

  const perPage = 20;
  const params = {
    id: activeOrganization.data?.id ?? "",
    perPage: perPage.toString(),
    sort: JSON.stringify([{ id: "expiresAt", desc: true }]),
    ...pickBy(filters, Boolean),
  };

  const invitations = useInfiniteQuery({
    queryKey: organization.queries.invitations.getAll(params).queryKey,
    queryFn: ({ pageParam }) =>
      organization.queries.invitations
        .getAll({
          ...params,
          page: pageParam.toString(),
        })
        .queryFn(),
    initialPageParam: 1,
    getNextPageParam: ({ total }, pages) =>
      total > pages.length * perPage ? pages.length + 1 : undefined,
  });

  const data = invitations.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <View className="flex-1 gap-2">
      <InvitationsListFilters onFiltersChange={setFilters} />
      <View className="border-border flex-1 rounded-md border">
        <FlatList
          data={data}
          renderItem={({ item }) => <InvitationListItem invitation={item} />}
          contentContainerClassName={cn({
            "flex-1": !data.length,
            "items-center justify-center":
              !data.length && !invitations.isLoading,
          })}
          ItemSeparatorComponent={() => <View className="bg-border h-px" />}
          showsVerticalScrollIndicator={false}
          onEndReached={() => invitations.fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            invitations.isFetchingNextPage && (
              <View>
                {Array.from({ length: 10 }).map((_, index) => (
                  <Fragment key={index}>
                    <View className="bg-border h-px" />
                    <InvitationListItemSkeleton />
                  </Fragment>
                ))}
              </View>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={invitations.isRefetching}
              onRefresh={() => invitations.refetch()}
              tintColor={primaryColor}
              colors={[primaryColor]}
            />
          }
          ListEmptyComponent={
            invitations.isLoading ? (
              <View className="w-full items-start">
                {Array.from({ length: 10 }).map((_, index, arr) => (
                  <Fragment key={index}>
                    <InvitationListItemSkeleton />
                    {index !== arr.length - 1 && (
                      <View className="bg-border h-px" />
                    )}
                  </Fragment>
                ))}
              </View>
            ) : (
              <Text>{t("noResults")}</Text>
            )
          }
        />
      </View>
    </View>
  );
};
