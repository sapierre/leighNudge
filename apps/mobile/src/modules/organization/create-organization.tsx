import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { createOrganizationSchema } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetCloseTrigger,
  BottomSheetOpenTrigger,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetScrollView,
  useBottomSheet,
} from "@turbostarter/ui-mobile/bottom-sheet";
import { Button } from "@turbostarter/ui-mobile/button";
import { Form, FormField, FormInput } from "@turbostarter/ui-mobile/form";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";

import { organization } from "./lib/api";

import type { CreateOrganizationPayload } from "@turbostarter/auth";
import type { BottomSheetContentRef } from "@turbostarter/ui-mobile/bottom-sheet";

export const CreateOrganizationBottomSheet = ({
  children,
  ref,
}: {
  children?: React.ReactNode;
  ref?: React.RefObject<BottomSheetContentRef | null>;
}) => {
  const { t } = useTranslation(["common", "organization"]);
  const sheet = useBottomSheet();

  const activeOrganization = authClient.useActiveOrganization();
  const activeMember = authClient.useActiveMember();

  const form = useForm({
    resolver: standardSchemaResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const getSlug = useMutation(organization.mutations.getSlug);
  const setActive = useMutation({
    ...organization.mutations.setActive,
    onSuccess: () => {
      activeOrganization.refetch();
      activeMember.refetch();
    },
  });
  const create = useMutation(organization.mutations.create);

  const onSubmit = async (data: CreateOrganizationPayload) => {
    const { slug } = await getSlug.mutateAsync({
      query: data,
    });

    const organization = await create.mutateAsync({
      ...data,
      slug,
    });

    await setActive.mutateAsync({ organizationId: organization.id });

    ref?.current?.dismiss();
    sheet.close();
    router.replace(pathsConfig.dashboard.organization.index);
  };

  return (
    <BottomSheet>
      {children && (
        <BottomSheetOpenTrigger asChild>{children}</BottomSheetOpenTrigger>
      )}

      <BottomSheetContent
        ref={ref ?? sheet.ref}
        stackBehavior="replace"
        name="create-organization"
      >
        <BottomSheetScrollView>
          <BottomSheetHeader>
            <BottomSheetTitle>{t("create.title")}</BottomSheetTitle>
            <BottomSheetDescription>
              {t("create.description")}
            </BottomSheetDescription>
          </BottomSheetHeader>

          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormInput
                  {...field}
                  autoFocus
                  label={t("common:name")}
                  description={t("create.info")}
                  editable={!form.formState.isSubmitting}
                />
              )}
            />

            <View className="gap-2">
              <BottomSheetCloseTrigger asChild>
                <Button variant="outline">
                  <Text>{t("cancel")}</Text>
                </Button>
              </BottomSheetCloseTrigger>
              <Button
                onPress={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Spin>
                    <Icons.Loader2
                      className="text-primary-foreground"
                      size={16}
                    />
                  </Spin>
                ) : (
                  <Text>{t("create.cta")}</Text>
                )}
              </Button>
            </View>
          </Form>
        </BottomSheetScrollView>
      </BottomSheetContent>
    </BottomSheet>
  );
};
