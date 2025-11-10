"use client";

import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import { AuthProvider } from "@turbostarter/auth";
import { useTranslation } from "@turbostarter/i18n";
import { Button } from "@turbostarter/ui-mobile/button";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { pathsConfig } from "~/config/paths";

import { auth } from "../lib/api";

import { useAuthFormStore } from "./store";

import type { Route } from "expo-router";

interface AnonymousLoginProps {
  readonly redirectTo?: Route;
}

export const AnonymousLogin = ({
  redirectTo = pathsConfig.index,
}: AnonymousLoginProps) => {
  const { t } = useTranslation(["auth", "common"]);
  const { provider, setProvider, isSubmitting, setIsSubmitting } =
    useAuthFormStore();

  const signIn = useMutation({
    ...auth.mutations.signIn.anonymous,
    onMutate: () => {
      setProvider(AuthProvider.ANONYMOUS);
      setIsSubmitting(true);
    },
    onSuccess: () => {
      router.navigate(redirectTo);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  return (
    <Button
      variant="outline"
      className="flex-row gap-2"
      size="lg"
      disabled={isSubmitting}
      onPress={() => signIn.mutate(undefined)}
    >
      {isSubmitting && provider === AuthProvider.ANONYMOUS ? (
        <Spin>
          <Icons.Loader2 className="text-foreground size-5" />
        </Spin>
      ) : (
        <>
          <Icons.UserRound className="text-foreground" size={16} />
          <Text>{t("login.anonymous.cta")}</Text>
        </>
      )}
    </Button>
  );
};
