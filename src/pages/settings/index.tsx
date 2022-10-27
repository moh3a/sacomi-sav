import Link from "next/link";

import Button from "../../components/shared/Button";

const SettingsScreen = () => {
  return (
    <div className="max-w-xl mx-auto">
      <Link href="/settings/migrations" passHref>
        <div className="flex justify-center items-center">
          <Button
            variant="outline"
            type="button"
            className="hover:underline hover:decoration-primary hover:underline-offset-2 hover:decoration-double"
          >
            Migrations
          </Button>
        </div>
      </Link>
      <Link href="/settings/profile" passHref>
        <div className="flex justify-center items-center">
          <Button
            variant="outline"
            type="button"
            className="hover:underline hover:decoration-primary hover:underline-offset-2 hover:decoration-double"
          >
            Profile
          </Button>
        </div>
      </Link>
    </div>
  );
};

import Layout from "../../components/layout/Layout";
SettingsScreen.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default SettingsScreen;
