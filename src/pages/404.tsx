import Head from "next/head";
import { PAGE_TITLE } from "../../lib/config";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>{"Not Found " + PAGE_TITLE}</title>
      </Head>
      <div className="flex-col text-center mt-28">
        <div className="text-6xl font-extrabold select-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r dark:from-rose-100 dark:to-teal-100 from-neutral-900 to-slate-900 ">
            404 | Not Found
          </span>
        </div>
      </div>
    </>
  );
};

import Layout from "../components/layout/Layout";
NotFound.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default NotFound;
