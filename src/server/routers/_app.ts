import { t } from "../trpc";
import { clientRouter } from "./clients";
import { deliveryRouter } from "./deliveries";
import { entryRouter } from "./entries";
import { orderRouter } from "./orders";
import { productRouter } from "./products";
import { prestationRouter } from "./services";
import { jobRouter } from "./jobs";
import { transactionRouter } from "./transactions";
import { userRouter } from "./users";
import { configRouter } from "./config";

export const appRouter = t.router({
  healthcheck: t.procedure.query(() => {
    return "yay";
  }),

  config: configRouter,
  clients: clientRouter,
  deliveries: deliveryRouter,
  entries: entryRouter,
  orders: orderRouter,
  products: productRouter,
  prestations: prestationRouter,
  jobs: jobRouter,
  transactions: transactionRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
