import { useMutation } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { View } from "react-native";

import { Skeleton } from "@turbostarter/ui-mobile/skeleton";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";
import {
  AvatarForm,
  AvatarFormPreview,
  AvatarFormUploadButton,
  AvatarFormRemoveButton,
} from "~/modules/common/avatar-form";
import { user } from "~/modules/user/lib/api";

const AccountInfoSkeleton = () => {
  return (
    <View className="items-center">
      <Skeleton className="mb-4 size-28 rounded-full" />
      <Skeleton className="mb-3 h-5 w-40" />
      <Skeleton className="h-5 w-64" />
    </View>
  );
};

export const AccountInfo = () => {
  const { data, isPending } = authClient.useSession();
  const updateUser = useMutation(user.mutations.update);

  if (isPending) {
    return <AccountInfoSkeleton />;
  }

  if (!data?.user) {
    return <Redirect href={pathsConfig.setup.auth.login} />;
  }

  return (
    <View className="items-center gap-4">
      <AvatarForm
        id={data.user.id}
        image={data.user.image}
        update={(image) => updateUser.mutateAsync({ image })}
      >
        <View className="relative">
          <AvatarFormPreview alt={data.user.name} />
          <AvatarFormUploadButton />
          <AvatarFormRemoveButton />
        </View>
      </AvatarForm>
      <View className="items-center px-6">
        <Text className="font-sans-semibold text-xl">{data.user.name}</Text>
        <Text className="text-muted-foreground text-center">
          {data.user.email}
        </Text>
      </View>
    </View>
  );
};
