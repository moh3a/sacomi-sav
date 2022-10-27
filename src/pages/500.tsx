import Head from "next/head";
import { PAGE_TITLE } from "../../lib/config";

const ServerError = () => {
  return (
    <>
      <Head>
        <title>{"Internal server error " + PAGE_TITLE}</title>
      </Head>
      <div className="flex-col text-center mt-28">
        <div className="text-6xl font-extrabold select-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r dark:from-rose-100 dark:to-teal-100 from-neutral-900 to-slate-900 ">
            500 | Internal Server Error
          </span>{" "}
          😱
        </div>
      </div>
    </>
  );
};

import Layout from "../components/layout/Layout";
ServerError.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default ServerError;
