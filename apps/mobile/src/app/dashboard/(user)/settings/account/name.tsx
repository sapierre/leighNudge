import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { updateUserSchema } from "@turbostarter/auth";
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
import { user } from "~/modules/user/lib/api";

const EditName = () => {
  const { t } = useTranslation(["common", "auth"]);
  const session = authClient.useSession();

  const form = useForm({
    resolver: standardSchemaResolver(updateUserSchema.pick({ name: true })),
    defaultValues: {
      name: session.data?.user.name ?? "",
    },
  });

  const updateUser = useMutation({
    ...user.mutations.update,
    onSuccess: () => {
      router.back();
    },
  });

  return (
    <View className="bg-background flex-1 p-6">
      <Form {...form}>
        <View className="flex-1 gap-6">
          <Text className="text-muted-foreground font-sans-medium text-base">
            {t("account.name.edit.description")}
          </Text>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormInput
                  {...field}
                  label={t("name")}
                  autoCapitalize="words"
                  autoComplete="name"
                  editable={!form.formState.isSubmitting}
                  value={field.value ?? ""}
                />

                <FormDescription>{t("account.name.edit.info")}</FormDescription>
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            size="lg"
            onPress={form.handleSubmit((data) => updateUser.mutateAsync(data))}
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
