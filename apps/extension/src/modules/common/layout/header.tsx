import { LocaleCustomizer } from "@turbostarter/ui-web/i18n";

import { authClient } from "~/lib/auth";
import { useLocale } from "~/lib/i18n";
import { ThemeControls } from "~/modules/common/theme";
import {
  UserNavigation,
  UserNavigationSkeleton,
} from "~/modules/user/user-navigation";

export const Header = () => {
  const { change } = useLocale();

  return (
    <div className="flex items-center justify-between gap-2">
      <LocaleCustomizer onChange={change} variant="icon" />
      <ThemeControls />
      <User />
    </div>
  );
};

const User = () => {
  const session = authClient.useSession();
  const organization = authClient.useActiveOrganization();

  if (session.isPending || organization.isPending) {
    return <UserNavigationSkeleton />;
  }
  const user = session.data?.user;

  return (
    <UserNavigation user={user ?? null} organization={organization.data} />
  );
};
