import { t } from "../trpc";
import { observable } from "@trpc/server/observable";

import { clientRouter } from "./clients";
import { deliveryRouter } from "./deliveries";
import { entryRouter } from "./entries";
import { orderRouter } from "./orders";
import { productRouter } from "./products";
import { prestationRouter } from "./services";
import { prestationDetailsRouter } from "./serviceDetails";
import { jobRouter } from "./jobs";
import { transactionRouter } from "./transactions";
import { stockRouter } from "./stocks";
import { partRouter } from "./parts";
import { userRouter } from "./users";
import { configRouter } from "./config";

import { CollectionsNames } from "../../types";

import { EventEmitter } from "events";

interface MyEvents {
  check: (is: boolean) => void;
  action: (collection: CollectionsNames) => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}
class MyEventEmitter extends EventEmitter {}

export const ee = new MyEventEmitter();

export const appRouter = t.router({
  onCheck: t.procedure.subscription(() => {
    return observable<boolean>((emit) => {
      const check = (is: boolean) => emit.next(is);
      ee.on("check", check);
      return () => {
        ee.off("check", check);
      };
    });
  }),

  onAction: t.procedure.subscription(() => {
    return observable<CollectionsNames>((emit) => {
      const reaction = (collection: CollectionsNames) => emit.next(collection);
      ee.on("action", reaction);
      return () => {
        ee.off("action", reaction);
      };
    });
  }),

  config: configRouter,
  clients: clientRouter,
  deliveries: deliveryRouter,
  entries: entryRouter,
  orders: orderRouter,
  products: productRouter,
  prestations: prestationRouter,
  prestationDetails: prestationDetailsRouter,
  jobs: jobRouter,
  transactions: transactionRouter,
  stocks: stockRouter,
  parts: partRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
