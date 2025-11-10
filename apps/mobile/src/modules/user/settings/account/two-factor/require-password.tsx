import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { passwordSchema } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import {
  BottomSheet,
  BottomSheetCloseTrigger,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetOpenTrigger,
  BottomSheetScrollView,
  BottomSheetTitle,
  useBottomSheet,
} from "@turbostarter/ui-mobile/bottom-sheet";
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

import type { PasswordPayload } from "@turbostarter/auth";
import type { BottomSheetContentRef } from "@turbostarter/ui-mobile/bottom-sheet";

interface RequirePasswordProps {
  readonly title?: string;
  readonly description?: string;
  readonly cta?: string;
  readonly onConfirm: (data: PasswordPayload) => Promise<void>;
  readonly children: React.ReactNode;
  readonly ref?: React.RefObject<BottomSheetContentRef>;
}

export const RequirePassword = memo<RequirePasswordProps>(
  ({ title, description, onConfirm, cta, children, ref: passedRef }) => {
    const { t } = useTranslation(["common", "auth"]);
    const { ref: bottomSheetRef } = useBottomSheet();

    const ref = passedRef ?? bottomSheetRef;

    const form = useForm({
      resolver: standardSchemaResolver(passwordSchema),
      defaultValues: {
        password: "",
      },
    });

    const handleSubmit = useCallback(
      async (data: PasswordPayload) => {
        await onConfirm(data);
        form.reset();
        ref.current?.close();
      },
      [onConfirm, form, ref],
    );

    return (
      <BottomSheet>
        <BottomSheetOpenTrigger asChild>{children}</BottomSheetOpenTrigger>
        <BottomSheetContent
          ref={ref}
          stackBehavior="replace"
          name="require-password"
        >
          <BottomSheetScrollView>
            <BottomSheetHeader>
              <BottomSheetTitle>
                {title ?? t("account.password.require.title")}
              </BottomSheetTitle>
              <BottomSheetDescription>
                {description ?? t("account.password.require.description")}
              </BottomSheetDescription>
            </BottomSheetHeader>

            <Form {...form}>
              <View className="flex-1 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormInput
                        autoFocus
                        label={t("password")}
                        secureTextEntry
                        autoComplete="password"
                        editable={!form.formState.isSubmitting}
                        {...field}
                      />
                    </FormItem>
                  )}
                />

                <View className="mt-auto gap-2">
                  <BottomSheetCloseTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Text>{t("cancel")}</Text>
                    </Button>
                  </BottomSheetCloseTrigger>
                  <Button
                    className="flex-1"
                    disabled={form.formState.isSubmitting}
                    onPress={form.handleSubmit(handleSubmit)}
                  >
                    {form.formState.isSubmitting ? (
                      <Spin>
                        <Icons.Loader2
                          className="text-primary-foreground"
                          size={16}
                        />
                      </Spin>
                    ) : (
                      <Text>{cta ?? t("continue")}</Text>
                    )}
                  </Button>
                </View>
              </View>
            </Form>
          </BottomSheetScrollView>
        </BottomSheetContent>
      </BottomSheet>
    );
  },
);

RequirePassword.displayName = "RequirePassword";
