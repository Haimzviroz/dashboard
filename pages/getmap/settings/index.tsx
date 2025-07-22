import { NextPageWithLayout } from "@/types/types";
import GM_layout from "@/components/layout/GM-layout";
import { ReactElement } from "react";
import Settings from "@/components/settings/settings";

const SettingsPage: NextPageWithLayout = () => {
  return <Settings />;
};

SettingsPage.getLayout = (page: ReactElement) => {
  return <GM_layout page={page} />;
};

export default SettingsPage;