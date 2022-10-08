import Link from "next/link";

import Button from "../../components/shared/Button";

const SettingsScreen = () => {
  return (
    <div className="max-w-xl mx-auto">
      <Link href="/settings/migrations">
        <Button variant="solid" type="button">
          Migrations
        </Button>
      </Link>
    </div>
  );
};

import Layout from "../../components/layout/Layout";
SettingsScreen.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default SettingsScreen;
