import {
  GoogleSignin,
  isCancelledResponse,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import env from "env.config";
import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { memo } from "react";
import { View } from "react-native";

import { SocialProvider as SocialProviderType } from "@turbostarter/auth";
import { Trans, useTranslation } from "@turbostarter/i18n";
import { Badge } from "@turbostarter/ui-mobile/badge";
import { Button } from "@turbostarter/ui-mobile/button";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { Text } from "@turbostarter/ui-mobile/text";

import { authConfig } from "~/config/auth";
import { pathsConfig } from "~/config/paths";
import { authClient } from "~/lib/auth";
import { useAuthFormStore } from "~/modules/auth/form/store";
import { isAndroid, isIOS } from "~/utils/device";

import { auth } from "../lib/api";

import type { AuthProvider } from "@turbostarter/auth";
import type { Icon } from "@turbostarter/ui-mobile/icons";
import type { Route } from "expo-router";

interface SocialProvidersProps {
  readonly providers: SocialProviderType[];
  readonly redirectTo?: Route;
}

export const SocialIcons: Record<SocialProviderType, Icon> = {
  [SocialProviderType.GITHUB]: Icons.Github,
  [SocialProviderType.GOOGLE]: Icons.Google,
  [SocialProviderType.APPLE]: Icons.Apple,
};

if (
  authConfig.providers.oAuth.includes(SocialProviderType.GOOGLE) &&
  isAndroid
) {
  GoogleSignin.configure({
    webClientId: env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });
}

const SocialProvider = ({
  provider,
  onClick,
  actualProvider,
  isSubmitting,
}: {
  provider: SocialProviderType;
  isSubmitting: boolean;
  onClick: () => void;
  actualProvider: AuthProvider;
}) => {
  const { t } = useTranslation("common");
  const Icon = SocialIcons[provider];

  return (
    <Button
      key={provider}
      variant="outline"
      size="lg"
      className="relative w-full flex-row justify-center gap-2.5"
      onPress={onClick}
      disabled={isSubmitting}
    >
      {isSubmitting && actualProvider === provider ? (
        <Spin>
          <Icons.Loader2 className="text-foreground size-5" />
        </Spin>
      ) : (
        <>
          <View className="size-6">
            <Icon className="text-foreground" />
          </View>
          <Text>
            <Trans
              ns="auth"
              i18nKey="login.social"
              values={{ provider }}
              components={{
                capitalize: <Text className="capitalize" />,
              }}
            />
          </Text>
        </>
      )}

      {authClient.isLastUsedLoginMethod(provider) && (
        <Badge
          className="absolute shadow-sm"
          style={{
            top: -8,
            right: -12,
          }}
        >
          <Text>{t("lastUsed")}</Text>
        </Badge>
      )}
    </Button>
  );
};

export const SocialProviders = memo<SocialProvidersProps>(
  ({ providers, redirectTo = pathsConfig.index }) => {
    const {
      provider: actualProvider,
      setProvider,
      isSubmitting,
      setIsSubmitting,
    } = useAuthFormStore();

    const signIn = useMutation({
      ...auth.mutations.signIn.social,
      onMutate: ({ provider }) => {
        setProvider(provider as SocialProviderType);
        setIsSubmitting(true);
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
      onSuccess: async () => {
        const session = await authClient.getSession({
          fetchOptions: { throw: true },
        });

        if (session?.session) {
          router.navigate(redirectTo);
        }
      },
    });

    const getParams = async (provider: SocialProviderType) => {
      const shared = {
        provider,
        callbackURL: redirectTo,
        errorCallbackURL: pathsConfig.setup.auth.error,
      };

      if (provider === SocialProviderType.APPLE && isIOS) {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        return {
          ...shared,
          ...(credential.identityToken
            ? { idToken: { token: credential.identityToken } }
            : {}),
        };
      }

      if (provider === SocialProviderType.GOOGLE && isAndroid) {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (isCancelledResponse(response)) {
          return null;
        }

        const tokens = await GoogleSignin.getTokens();

        return {
          ...shared,
          ...(isSuccessResponse(response)
            ? {
                idToken: {
                  token: tokens.idToken,
                  accessToken: tokens.accessToken,
                },
              }
            : {}),
        };
      }

      return shared;
    };

    return (
      <View className="flex w-full items-stretch justify-center gap-2">
        {Object.values(providers).map((provider) => (
          <SocialProvider
            key={provider}
            provider={provider}
            onClick={async () => {
              const params = await getParams(provider);
              if (params) {
                await signIn.mutateAsync(params);
              }
            }}
            actualProvider={actualProvider}
            isSubmitting={isSubmitting}
          />
        ))}
      </View>
    );
  },
);

SocialProviders.displayName = "SocialProviders";
