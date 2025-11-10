import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";

import { AuthProvider, generateName, registerSchema } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import {
  Form,
  FormField,
  FormItem,
  FormInput,
} from "@turbostarter/ui-mobile/form";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { Link } from "~/modules/common/styled";

import { auth } from "../lib/api";

import { useAuthFormStore } from "./store";

import type { Route } from "expo-router";

interface RegisterFormProps {
  readonly redirectTo?: Route;
  readonly email?: string;
}

export const RegisterForm = ({
  redirectTo = pathsConfig.index,
  email,
}: RegisterFormProps) => {
  const { t } = useTranslation(["common", "auth"]);
  const { provider, setProvider, isSubmitting, setIsSubmitting } =
    useAuthFormStore();

  const form = useForm({
    resolver: standardSchemaResolver(registerSchema),
    defaultValues: {
      email,
    },
  });

  const signUp = useMutation({
    ...auth.mutations.signUp.email,
    onMutate: () => {
      setProvider(AuthProvider.PASSWORD);
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
    onSuccess: () => {
      Alert.alert(
        t("register.success.title"),
        t("register.success.description"),
        [
          {
            text: t("continue"),
            onPress: () => {
              router.navigate(pathsConfig.setup.auth.login);
              form.reset();
            },
          },
        ],
      );
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
              <FormInput
                label={t("password")}
                secureTextEntry
                autoComplete="password"
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
            signUp.mutateAsync({
              ...data,
              name: generateName(data.email),
              callbackURL: redirectTo,
            }),
          )}
          disabled={isSubmitting}
        >
          {isSubmitting && provider === AuthProvider.PASSWORD ? (
            <Spin>
              <Icons.Loader2 className="text-primary-foreground size-5" />
            </Spin>
          ) : (
            <Text>{t("register.cta")}</Text>
          )}
        </Button>
      </View>
    </Form>
  );
};

export const RegisterCta = () => {
  const { t } = useTranslation("auth");
  const localParams = useLocalSearchParams();
  const searchParams = new URLSearchParams(
    localParams as Record<string, string>,
  );

  return (
    <View className="items-center justify-center pt-2">
      <View className="flex-row">
        <Text className="text-muted-foreground text-sm">
          {t("login.noAccount")}
        </Text>
        <Link
          href={`${pathsConfig.setup.auth.register}?${searchParams.toString()}`}
          className="text-muted-foreground active:text-primary pl-2 font-sans text-sm underline"
        >
          {t("register.cta")}
        </Link>
      </View>
    </View>
  );
};
