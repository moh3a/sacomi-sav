import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

import prisma from "../../lib/prisma";
import { ISession } from "../types";

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req });
  return {
    req,
    res,
    prisma,
    session: session as ISession | null,
    // session: {
    //   expires: session?.expires,
    //   user: {
    //     ...session?.user,
    //     role: (session?.user as any).role as string | null | undefined,
    //   },
    // },
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
