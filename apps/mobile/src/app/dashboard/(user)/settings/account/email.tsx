import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";

import { emailSchema } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import { cn } from "@turbostarter/ui";
import { Badge } from "@turbostarter/ui-mobile/badge";
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

import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";
import { auth } from "~/modules/auth/lib/api";
import { ScrollView } from "~/modules/common/styled";

const EditEmail = () => {
  const { t } = useTranslation(["common", "auth"]);
  const { data, refetch } = authClient.useSession();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const form = useForm({
    resolver: standardSchemaResolver(emailSchema),
    defaultValues: {
      email: data?.user.email ?? "",
    },
  });

  const sendVerification = useMutation({
    ...auth.mutations.email.sendVerification,
    onSuccess: () => {
      Alert.alert(t("message"), t("account.email.confirm.email.sent"));
    },
  });

  const changeEmail = useMutation({
    ...auth.mutations.email.change,
    onSuccess: () => {
      Alert.alert(t("message"), t("account.email.change.success"));
    },
  });

  return (
    <ScrollView
      bounces={false}
      contentContainerClassName="bg-background flex-1 p-6"
    >
      <Form {...form}>
        <View className="flex-1 gap-6">
          <View className="gap-2">
            <View className="flex-row items-center gap-3">
              <Badge
                className={cn(
                  data?.user.emailVerified
                    ? "bg-success border-transparent"
                    : "bg-destructive border-transparent",
                )}
              >
                <Text
                  className={
                    data?.user.emailVerified
                      ? "text-success-foreground"
                      : "text-destructive-foreground"
                  }
                >
                  {data?.user.emailVerified ? t("verified") : t("unverified")}
                </Text>
              </Badge>
              {!data?.user.emailVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() =>
                    sendVerification.mutateAsync({
                      email: data?.user.email ?? "",
                      callbackURL:
                        pathsConfig.dashboard.user.settings.account.email,
                      fetchOptions: {
                        headers: {
                          "x-url": Linking.createURL(
                            pathsConfig.dashboard.user.settings.account.email,
                          ),
                        },
                      },
                    })
                  }
                  disabled={sendVerification.isPending}
                >
                  <Text>
                    {sendVerification.isPending
                      ? t("account.email.confirm.loading")
                      : t("account.email.confirm.cta")}
                  </Text>
                </Button>
              )}
            </View>
            <Text className="text-muted-foreground font-sans-medium text-base">
              {t("account.email.change.description")}
            </Text>
          </View>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormInput
                  label={t("email")}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  editable={!form.formState.isSubmitting}
                  {...field}
                />
                <FormDescription>
                  {t("account.email.change.info")}
                </FormDescription>
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            size="lg"
            onPress={form.handleSubmit((data) =>
              changeEmail.mutateAsync({
                newEmail: data.email,
                callbackURL: pathsConfig.dashboard.user.settings.account.email,
                fetchOptions: {
                  headers: {
                    "x-url": Linking.createURL(
                      pathsConfig.dashboard.user.settings.account.email,
                    ),
                  },
                },
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
    </ScrollView>
  );
};

export default EditEmail;
