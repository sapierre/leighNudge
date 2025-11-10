import { useEffect } from "react";

import { track } from "@turbostarter/analytics-extension";

import { Layout, render } from "~/modules/common/layout/layout";
import { Main } from "~/modules/common/main";

const Popup = () => {
  useEffect(() => {
    track("popup_viewed");
  }, []);

  return (
    <Layout>
      <Main className="w-[23rem] px-4" filename="app/popup" />
    </Layout>
  );
};

render("root", <Popup />);
