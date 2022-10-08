import { z } from "zod";
import { t } from "../trpc";

export const configRouter = t.router({
  currentId: t.procedure
    .input(
      z.object({
        collection: z.enum([
          "deliveries",
          "entries",
          "jobs",
          "orders",
          "prestations",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const config = await ctx.prisma.config.findFirst({
          select: {
            current_deliveries_id:
              input.collection === "deliveries" ? true : false,
            current_entries_id: input.collection === "entries" ? true : false,
            current_jobs_id: input.collection === "jobs" ? true : false,
            current_orders_id: input.collection === "orders" ? true : false,
            current_prestations_id:
              input.collection === "prestations" ? true : false,
          },
        });
        return { config };
      } else return { config: null };
    }),
});
