import { createWSClient, httpBatchLink, wsLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";
import superjson from "superjson";

import getConfig from "next/config";
import { NextPageContext } from "next";
const { publicRuntimeConfig } = getConfig();
const { PORT, HOST, WORK_ENV, WS_URL } = publicRuntimeConfig;

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  // assume localhost
  if (WORK_ENV === "local")
    return `http://${HOST ?? "localhost"}:${PORT ?? 3000}`;
  return `http://localhost:3000`;
}

function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        if (ctx?.req) {
          // on ssr, forward client's headers to the server
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
    });
  }
  const wsClient = createWSClient({
    url: WS_URL,
  });
  return wsLink<AppRouter>({
    client: wsClient,
  });
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        // httpBatchLink({
        //   url: `${getBaseUrl()}/api/trpc`,
        // }),
        // wsLink<AppRouter>({
        //   client: wsClient,
        // }),
        getEndingLink(ctx),
      ],
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: true,
  responseMeta({ ctx, clientErrors }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      "Cache-Control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },
});
