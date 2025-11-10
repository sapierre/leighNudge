import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";

import { AuthProvider } from "@turbostarter/auth";
import { magicLinkLoginSchema } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import {
  Form,
  FormField,
  FormInput,
  FormItem,
} from "@turbostarter/ui-mobile/form";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { useAuthFormStore } from "~/modules/auth/form/store";

import { auth } from "../../lib/api";

import type { Route } from "expo-router";

interface MagicLinkLoginFormProps {
  readonly redirectTo?: Route;
  readonly email?: string;
}

export const MagicLinkLoginForm = memo<MagicLinkLoginFormProps>(
  ({ redirectTo = pathsConfig.index, email }) => {
    const { t } = useTranslation(["common", "auth"]);
    const { provider, setProvider, isSubmitting, setIsSubmitting } =
      useAuthFormStore();

    const form = useForm({
      resolver: standardSchemaResolver(magicLinkLoginSchema),
      defaultValues: {
        email: email ?? "",
      },
    });

    const signIn = useMutation({
      ...auth.mutations.signIn.magicLink,
      onMutate: () => {
        setProvider(AuthProvider.MAGIC_LINK);
        setIsSubmitting(true);
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
      onSuccess: () => {
        Alert.alert(
          t("login.magicLink.success.title"),
          t("login.magicLink.success.description"),
        );
        form.reset();
      },
    });

    return (
      <Form {...form}>
        <View className="gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormInput
                  label={t("email")}
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isSubmitting}
                  {...field}
                />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            size="lg"
            onPress={form.handleSubmit((data) =>
              signIn.mutateAsync({
                ...data,
                callbackURL: redirectTo,
              }),
            )}
            disabled={isSubmitting}
          >
            {isSubmitting && provider === AuthProvider.MAGIC_LINK ? (
              <Spin>
                <Icons.Loader2 className="text-primary-foreground size-5" />
              </Spin>
            ) : (
              <Text>{t("login.magicLink.cta")}</Text>
            )}
          </Button>
        </View>
      </Form>
    );
  },
);
