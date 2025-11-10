import { Trans } from "@turbostarter/i18n";
import { getTranslation } from "@turbostarter/i18n/server";

import { appConfig } from "~/config/app";
import { pathsConfig } from "~/config/paths";
import { BaseLayout } from "~/modules/common/layout/base";
import { TurboLink } from "~/modules/common/turbo-link";

export default async function NotFound() {
  const { t } = await getTranslation({ ns: ["marketing", "common"] });

  return (
    <BaseLayout locale={appConfig.locale}>
      <main className="mx-auto flex max-w-xl flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="mt-4 text-4xl font-bold">{t("error.notFound")}</h1>
          <p className="text-center text-lg leading-tight text-pretty">
            <Trans
              t={t}
              i18nKey="editToReload"
              values={{
                file: "src/app/[locale]/not-found.tsx",
              }}
              components={{
                code: (
                  <code className="bg-muted text-muted-foreground mt-4 inline-block rounded-sm px-1.5 text-sm" />
                ),
              }}
            />
          </p>
          <TurboLink
            href={pathsConfig.index}
            className="text-primary mt-6 inline-block underline underline-offset-4 hover:no-underline"
          >
            {t("goBackHome")}
          </TurboLink>
        </div>
      </main>
    </BaseLayout>
  );
}
