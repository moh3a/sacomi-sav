import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";
import superjson from "superjson";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { PORT, HOST, WORK_ENV } = publicRuntimeConfig;

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  // assume localhost
  if (WORK_ENV) return `http://${HOST ?? "localhost"}:${PORT ?? 3000}`;
  return `http://localhost:3000`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
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
