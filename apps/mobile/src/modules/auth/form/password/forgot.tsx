import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";

import { forgotPasswordSchema } from "@turbostarter/auth";
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
import { Link } from "~/modules/common/styled";

import { auth } from "../../lib/api";

export const ForgotPasswordForm = () => {
  const { t } = useTranslation(["common", "auth"]);

  const form = useForm({
    resolver: standardSchemaResolver(forgotPasswordSchema),
  });

  const forgetPassword = useMutation({
    ...auth.mutations.password.forget,
    onSuccess: () => {
      Alert.alert(
        t("account.password.forgot.success.title"),
        t("account.password.forgot.success.description"),
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
                editable={!form.formState.isSubmitting}
                {...field}
              />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          size="lg"
          onPress={form.handleSubmit((data) =>
            forgetPassword.mutateAsync({
              ...data,
              redirectTo: Linking.createURL(
                pathsConfig.setup.auth.updatePassword,
              ),
            }),
          )}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Spin>
              <Icons.Loader2 className="text-primary-foreground size-5" />
            </Spin>
          ) : (
            <Text>{t("account.password.forgot.cta")}</Text>
          )}
        </Button>

        <View className="items-center justify-center pt-2">
          <Link
            replace
            href={pathsConfig.setup.auth.login}
            className="text-muted-foreground active:text-primary pl-2 font-sans text-sm underline"
          >
            {t("account.password.forgot.back")}
          </Link>
        </View>
      </View>
    </Form>
  );
};
