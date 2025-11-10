import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { updateOrganizationSchema } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import {
  Form,
  FormField,
  FormItem,
  FormInput,
  FormDescription,
} from "@turbostarter/ui-mobile/form";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { authClient } from "~/lib/auth";
import { organization } from "~/modules/organization/lib/api";
import { toMemberRole } from "~/modules/organization/lib/utils";

const EditName = () => {
  const { t } = useTranslation(["common", "organization"]);
  const { data: activeOrganization, refetch } =
    authClient.useActiveOrganization();
  const { data: activeMember } = authClient.useActiveMember();

  const form = useForm({
    resolver: standardSchemaResolver(
      updateOrganizationSchema.pick({ name: true }),
    ),
    defaultValues: {
      name: activeOrganization?.name,
    },
  });

  const hasUpdatePermission = authClient.organization.checkRolePermission({
    permission: {
      organization: ["update"],
    },
    role: toMemberRole(activeMember?.role),
  });

  const updateOrganization = useMutation({
    ...organization.mutations.update,
    onSuccess: () => {
      refetch();
      router.back();
    },
  });

  if (!activeOrganization || !hasUpdatePermission) {
    return null;
  }

  return (
    <View className="bg-background flex-1 p-6">
      <Form {...form}>
        <View className="flex-1 gap-6">
          <Text className="text-muted-foreground font-sans-medium">
            {t("name.edit.description")}
          </Text>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormInput
                  {...field}
                  label={t("common:name")}
                  autoCapitalize="words"
                  autoComplete="name"
                  editable={!form.formState.isSubmitting}
                  value={field.value ?? ""}
                />

                <FormDescription>{t("name.edit.info")}</FormDescription>
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            size="lg"
            onPress={form.handleSubmit((data) =>
              updateOrganization.mutateAsync({
                data,
                organizationId: activeOrganization.id,
              }),
            )}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spin>
                <Icons.Loader2 className="text-primary-foreground" />
              </Spin>
            ) : (
              <Text>{t("save")}</Text>
            )}
          </Button>
        </View>
      </Form>
    </View>
  );
};

export default EditName;
