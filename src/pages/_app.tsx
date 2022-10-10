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
        {/* Primary Meta Tags
<title>Meta Tags — Preview, Edit and Generate</title>
<meta name="title" content="Meta Tags — Preview, Edit and Generate">
<meta name="description" content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!">

Open Graph / Facebook 
<meta property="og:type" content="website">
<meta property="og:url" content="https://metatags.io/">
<meta property="og:title" content="Meta Tags — Preview, Edit and Generate">
<meta property="og:description" content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!">
<meta property="og:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png">

Twitter
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://metatags.io/">
<meta property="twitter:title" content="Meta Tags — Preview, Edit and Generate">
<meta property="twitter:description" content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!">
<meta property="twitter:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"> */}
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
