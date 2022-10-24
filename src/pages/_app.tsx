import "../styles/globals.css";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import type { Session } from "next-auth";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";

import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import { APP_TITLE } from "../../lib/config";
import { useStore } from "../redux/store";
import { NotificationsProvider } from "../utils/NotificationsContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout = (Component as any).getLayout || ((page: NextPage) => page);
  const store = useStore((pageProps as any).initialReduxState);

  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
      </Head>
      <ThemeProvider attribute="class">
        <SessionProvider session={session}>
          <ReduxProvider store={store}>
            <NotificationsProvider>
              {getLayout(<Component {...pageProps} />)}
            </NotificationsProvider>
          </ReduxProvider>
        </SessionProvider>
      </ThemeProvider>
      <noscript>Enable javascript to run this web app.</noscript>
    </>
  );
};

export default trpc.withTRPC(MyApp);
