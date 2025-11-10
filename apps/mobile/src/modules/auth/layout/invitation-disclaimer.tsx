"use client";

import { useTranslation } from "@turbostarter/i18n";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@turbostarter/ui-mobile/alert";
import { Icons } from "@turbostarter/ui-mobile/icons";

export const InvitationDisclaimer = () => {
  const { t } = useTranslation("organization");

  return (
    <Alert icon={Icons.MailPlus} variant="primary">
      <AlertTitle>{t("invitations.disclaimer.title")}</AlertTitle>
      <AlertDescription>
        {t("invitations.disclaimer.description")}
      </AlertDescription>
    </Alert>
  );
};
