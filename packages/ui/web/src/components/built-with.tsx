"use client";

import * as React from "react";

import { useTranslation } from "@turbostarter/i18n";
import { cn } from "@turbostarter/ui";

import { buttonVariants } from "#components/button";
import { Icons } from "#components/icons";

export const BuiltWith = ({
  className,
  ...props
}: React.ComponentProps<"a">) => {
  const { t } = useTranslation("common");

  return (
    <a
      className={cn(
        buttonVariants({
          variant: "outline",
          className: "cursor-pointer font-sans",
        }),
        className,
      )}
      href="https://www.turbostarter.dev"
      target="_blank"
      {...props}
    >
      {t("builtWith")}{" "}
      <div className="flex shrink-0 items-center gap-1.5">
        <Icons.Logo className="text-primary h-4" />
        <Icons.LogoText className="text-foreground h-2.5" />
      </div>
    </a>
  );
};
