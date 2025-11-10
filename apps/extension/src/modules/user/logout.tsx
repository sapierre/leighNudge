import { useMutation } from "@tanstack/react-query";

import { useTranslation } from "@turbostarter/i18n";
import { Icons } from "@turbostarter/ui-web/icons";

import { authClient } from "~/lib/auth";

export const Logout = () => {
  const { t } = useTranslation("auth");

  const signOut = useMutation({
    mutationKey: ["auth", "signOut"],
    mutationFn: () => authClient.signOut(),
  });

  return (
    <button
      className="flex w-full items-center gap-1.5 text-left font-sans"
      onClick={() => signOut.mutate()}
    >
      <Icons.LogOut className="size-4" />
      {t("logout.cta")}
    </button>
  );
};
