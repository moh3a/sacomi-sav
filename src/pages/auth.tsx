import { useRouter } from "next/router";
import { getCsrfToken } from "next-auth/react";

import Auth from "../components/auth/Auth";
import Banner from "../components/shared/Banner";
import { AuthenticationPageProps } from "../types";

const Authentication = ({ csrfToken }: AuthenticationPageProps) => {
  const router = useRouter();

  return (
    <>
      {router.query && router.query.error && (
        <Banner
          type="error"
          message={`
              Impossible de se connecter.\n
              Message: ${router.query.error}`}
        />
      )}
      <Auth csrfToken={csrfToken} />
    </>
  );
};

import { GetServerSideProps } from "next";
export const getServerSideProps: GetServerSideProps = async (context) => {
  // using unstable_getServerSession function causes a callbackUrl error
  // redirecting if auth is handled client side for this route
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
};

import Layout from "../components/layout/Layout";
Authentication.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Authentication;
