import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { AuthProvider } from "@turbostarter/auth";
import { passwordLoginSchema } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import {
  Form,
  FormCheckbox,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
} from "@turbostarter/ui-mobile/form";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { useAuthFormStore } from "~/modules/auth/form/store";
import { Link } from "~/modules/common/styled";

import { auth } from "../../lib/api";

import type { Route } from "expo-router";

interface PasswordLoginFormProps {
  readonly redirectTo?: Route;
  readonly email?: string;
  readonly onTwoFactorRedirect?: () => void;
}

export const PasswordLoginForm = memo<PasswordLoginFormProps>(
  ({ redirectTo = pathsConfig.index, email, onTwoFactorRedirect }) => {
    const { t } = useTranslation(["common", "auth"]);

    const { provider, setProvider, isSubmitting, setIsSubmitting } =
      useAuthFormStore();
    const form = useForm({
      resolver: standardSchemaResolver(passwordLoginSchema),
      defaultValues: {
        rememberMe: true,
        email,
      },
    });

    const signIn = useMutation({
      ...auth.mutations.signIn.email,
      onMutate: () => {
        setProvider(AuthProvider.PASSWORD);
        setIsSubmitting(true);
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
      onSuccess: (ctx) => {
        if ("twoFactorRedirect" in ctx) {
          return onTwoFactorRedirect?.();
        }

        router.navigate(redirectTo);
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <View className="flex-row items-center justify-between">
                  <FormLabel nativeID="password">{t("password")}</FormLabel>

                  <Link
                    href={pathsConfig.setup.auth.forgotPassword}
                    className="text-muted-foreground self-end font-sans text-sm underline"
                  >
                    {t("account.password.forgot.label")}
                  </Link>
                </View>
                <FormInput
                  secureTextEntry
                  autoComplete="password"
                  editable={!isSubmitting}
                  {...field}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormCheckbox
                className="-mt-2 -ml-0.5"
                name="rememberMe"
                label={t("rememberMe")}
                disabled={isSubmitting}
                value={!!field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Button
            className="w-full"
            size="lg"
            onPress={form.handleSubmit((data) => signIn.mutate(data))}
            disabled={isSubmitting}
          >
            {isSubmitting && provider === AuthProvider.PASSWORD ? (
              <Spin>
                <Icons.Loader2 className="text-primary-foreground" />
              </Spin>
            ) : (
              <Text>{t("login.cta")}</Text>
            )}
          </Button>
        </View>
      </Form>
    );
  },
);

PasswordLoginForm.displayName = "PasswordLoginForm";
