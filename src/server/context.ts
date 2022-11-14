import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { getSession } from "next-auth/react";

import prisma from "../../lib/prisma";
import { ISession } from "../types";
import { IncomingMessage } from "http";
import ws from "ws";

export const createContext = async ({
  req,
  res,
}:
  | trpcNext.CreateNextContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
  const session = await getSession({ req });
  return {
    req,
    res,
    prisma,
    session: session as ISession | null,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
