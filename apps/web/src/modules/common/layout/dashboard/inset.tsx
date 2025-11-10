import { SidebarInset } from "@turbostarter/ui-web/sidebar";

import { DashboardActionBar } from "./action-bar";

export const DashboardInset = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarInset className="mx-auto w-full max-w-[80rem]">
      <DashboardActionBar />
      <div className="flex w-full flex-1 flex-col items-start gap-6 p-4 !pt-0 md:p-6 lg:p-7">
        {children}
      </div>
    </SidebarInset>
  );
};
