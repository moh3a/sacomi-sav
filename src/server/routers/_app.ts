import { t } from "../trpc";
import { clientRouter } from "./clients";
import { deliveryRouter } from "./deliveries";
import { entryRouter } from "./entries";
import { orderRouter } from "./orders";
import { productRouter } from "./products";
import { prestationRouter } from "./services";
import { jobRouter } from "./jobs";
import { userRouter } from "./users";

export const appRouter = t.router({
  healthcheck: t.procedure.query(() => {
    return "yay";
  }),

  clients: clientRouter,
  deliveries: deliveryRouter,
  entries: entryRouter,
  orders: orderRouter,
  products: productRouter,
  prestations: prestationRouter,
  jobs: jobRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
