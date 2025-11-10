import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { backupCodeVerificationSchema, SecondFactor } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import {
  Form,
  FormCheckbox,
  FormField,
  FormInput,
  FormItem,
} from "@turbostarter/ui-mobile/form";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";

import { auth } from "../../lib/api";

import type { CtaProps, FormProps } from ".";

const BackupCodeForm = memo<FormProps>(({ redirectTo = pathsConfig.index }) => {
  const { t } = useTranslation(["common", "auth"]);
  const form = useForm({
    resolver: standardSchemaResolver(backupCodeVerificationSchema),
    defaultValues: {
      code: "",
      trustDevice: false,
    },
  });

  const verifyBackupCode = useMutation({
    ...auth.mutations.twoFactor.backupCodes.verify,
    onSuccess: () => {
      router.replace(redirectTo);
    },
  });

  return (
    <Form {...form}>
      <View className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormInput
                autoFocus
                placeholder={t("login.twoFactor.backupCode.placeholder")}
                autoCapitalize="none"
                autoComplete="one-time-code"
                editable={!form.formState.isSubmitting}
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trustDevice"
          render={({ field }) => (
            <FormCheckbox
              className="-mt-2 -ml-0.5"
              name="trustDevice"
              label={t("login.twoFactor.trustDevice")}
              value={field.value ?? false}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <Button
          className="w-full"
          size="lg"
          disabled={form.formState.isSubmitting}
          onPress={form.handleSubmit((data) =>
            verifyBackupCode.mutateAsync(data),
          )}
        >
          {form.formState.isSubmitting ? (
            <Spin>
              <Icons.Loader2 className="text-primary-foreground" />
            </Spin>
          ) : (
            <Text>{t("verify")}</Text>
          )}
        </Button>
      </View>
    </Form>
  );
});

const BackupCodeCta = memo<CtaProps>(({ onFactorChange }) => {
  const { t } = useTranslation("auth");
  return (
    <View className="flex items-center justify-center pt-2">
      <Text
        onPress={() => onFactorChange(SecondFactor.BACKUP_CODE)}
        className="text-muted-foreground font-sans-medium cursor-pointer pl-2 text-sm underline underline-offset-4"
      >
        {t("login.twoFactor.backupCode.cta")}
      </Text>
    </View>
  );
});

export { BackupCodeForm, BackupCodeCta };
