import { useTranslation } from "@turbostarter/i18n";
import { cn } from "@turbostarter/ui";
import { Button } from "@turbostarter/ui-web/button";
import { Icons } from "@turbostarter/ui-web/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@turbostarter/ui-web/popover";
import { ThemeCustomizer } from "@turbostarter/ui-web/theme";

import { appConfig } from "~/config/app";
import { StorageKey, useStorage } from "~/lib/storage";

const Customizer = () => {
  const { t } = useTranslation("common");
  const { data, set } = useStorage(StorageKey.THEME);

  return (
    <>
      <div className="flex items-start">
        <div className="space-y-1 pr-2">
          <div className="leading-none font-semibold tracking-tight">
            {t("theme.customization.title")}
          </div>
          <div className="text-muted-foreground text-xs">
            {t("theme.customization.description")}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            set(appConfig.theme);
          }}
        >
          <Icons.Undo2 className="size-4" />
          <span className="sr-only">{t("reset")}</span>
        </Button>
      </div>
      <ThemeCustomizer
        defaultConfig={appConfig.theme}
        config={data}
        onChange={set}
      />
    </>
  );
};

const Status = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { t } = useTranslation("common");

  return (
    <Button
      variant="outline"
      className={cn(
        "overflow-hidden rounded-full bg-transparent p-0 pr-3",
        className,
      )}
      {...props}
    >
      <span className="sr-only">{t("theme.customization.label")}</span>
      <div className="flex items-center justify-center gap-2.5">
        <div className="bg-primary size-[42px]"></div>
        <Icons.Sun className="size-[1.2rem] dark:hidden" />
        <Icons.Moon className="hidden size-[1.2rem] dark:block" />
      </div>
    </Button>
  );
};

export const ThemeControls = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Status />
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="z-40 w-[21.5rem] space-y-4 rounded-lg p-6"
      >
        <Customizer />
      </PopoverContent>
    </Popover>
  );
};
