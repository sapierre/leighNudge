import { match } from "@formatjs/intl-localematcher";
import dayjs from "dayjs";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import Negotiator from "negotiator";
import { initReactI18next } from "react-i18next/initReactI18next";
import * as z from "zod";

import { config, getInitOptions } from "../config";
import { env } from "../env";
import { loadTranslation, makeZodI18nMap } from "../utils";

import type { i18n, Namespace, TFunction } from "i18next";

export const initializeServerI18n = async ({
  locale,
  defaultLocale,
  ns,
}: {
  locale?: string;
  defaultLocale?: string;
  ns?: Namespace;
}): Promise<i18n> => {
  const i18n = createInstance();

  await i18n
    .use(initReactI18next)
    .use(resourcesToBackend(loadTranslation))
    .init(getInitOptions({ locale, defaultLocale, ns }));

  return i18n;
};

export const getLocaleFromCookies = async () => {
  try {
    const { cookies } = await import("next/headers");
    return (await cookies()).get(config.cookie)?.value;
  } catch {
    return undefined;
  }
};

export const getLocaleFromRequest = (request?: Request) => {
  if (!request) return env.DEFAULT_LOCALE ?? config.defaultLocale;

  const localeCookie = request.headers
    .get("cookie")
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith(`${config.cookie}=`))
    ?.split("=")[1]
    ?.trim()
    .replace(/[.,]/g, "");

  if (localeCookie) {
    return localeCookie;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value: string, key: string) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return match(
      languages,
      config.locales,
      env.DEFAULT_LOCALE ?? config.defaultLocale,
    );
  } catch {
    return env.DEFAULT_LOCALE ?? config.defaultLocale;
  }
};

export const getTranslation = async <T extends Namespace>({
  locale: passedLocale,
  request,
  ns,
}: { locale?: string; request?: Request; ns?: T } = {}) => {
  const locale =
    passedLocale ??
    (request ? getLocaleFromRequest(request) : null) ??
    (await getLocaleFromCookies()) ??
    undefined;
  const i18nextInstance = await initializeServerI18n({ locale, ns });
  dayjs.locale(i18nextInstance.language);

  const t = i18nextInstance.getFixedT<T>(
    i18nextInstance.language,
    ns,
  ) as TFunction<T>;

  z.config({
    localeError: makeZodI18nMap({ t: t as TFunction }),
  });

  return {
    t,
    i18n: i18nextInstance,
  };
};
