import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import * as Linking from "expo-linking";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import z from "zod";

import { Trans, useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import { Form, FormCheckbox, FormField } from "@turbostarter/ui-mobile/form";
import { Text } from "@turbostarter/ui-mobile/text";

import { useSetupSteps } from "~/app/(setup)/steps/_layout";
import { appConfig } from "~/config/app";
import { ScrollView } from "~/modules/common/styled";

export default function RequiredStep() {
  const { t } = useTranslation(["common", "marketing"]);
  const { goNext } = useSetupSteps();

  const form = useForm({
    resolver: standardSchemaResolver(
      z.object({
        data: z.boolean(),
        privacy: z.boolean(),
      }),
    ),
    defaultValues: {
      data: false,
      privacy: false,
    },
  });

  const values = form.watch();

  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        className="pt-4"
      >
        <View className="items-start gap-6">
          <View className="items-start gap-1">
            <Text className="font-sans-bold text-3xl tracking-tight">
              {t("setup.steps.step.required.title")}
            </Text>
            <Text className="text-muted-foreground text-lg leading-snug">
              {t("setup.steps.step.required.description")}
            </Text>
          </View>

          <View className="w-full gap-2">
            <Form {...form}>
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormCheckbox
                    className="-mt-2 -ml-0.5"
                    name="data"
                    label={t("setup.steps.step.required.fields.data")}
                    value={!!field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormCheckbox
                    className="-mt-2 -ml-0.5"
                    name="privacy"
                    label={
                      <Trans
                        i18nKey="setup.steps.step.required.fields.privacy"
                        ns="marketing"
                        components={{
                          a: (
                            <Text
                              onPress={() =>
                                Linking.openURL(
                                  `${appConfig.url}/legal/privacy-policy`,
                                )
                              }
                              className="font-sans-medium text-primary underline hover:no-underline"
                            />
                          ),
                        }}
                      />
                    }
                    value={!!field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Form>
          </View>
        </View>
      </ScrollView>

      <Button
        className="mt-auto"
        size="lg"
        onPress={() => goNext()}
        disabled={Object.values(values).some((value) => !value)}
      >
        <Text>{t("continue")}</Text>
      </Button>
    </>
  );
}
