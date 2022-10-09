import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";

export const orderRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        order_id: z.string().nullish(),
        order_date: z.string().nullish(),
        order_content: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        if (input.order_id)
          filters = {
            ...filters,
            order_id: { contains: input.order_id || "" },
          };
        if (input.order_date)
          filters = {
            ...filters,
            order_date: { contains: input.order_date || "" },
          };
        if (input.order_content)
          filters = {
            ...filters,
            order_content: { contains: input.order_content || "" },
          };
        const count = await ctx.prisma.order.count();
        const orders = await ctx.prisma.order.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          orderBy: { id: "desc" },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { orders, count };
      } else {
        return { orders: [], count: 0 };
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const order = await ctx.prisma.order.findUnique({
          where: { id: input.id },
        });
        return { order };
      } else return { order: null };
    }),
  byUnique: t.procedure
    .input(z.object({ order_id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const order = await ctx.prisma.order.findUnique({
          where: { order_id: input.order_id },
        });
        return { order };
      } else return { order: null };
    }),
  create: t.procedure
    .input(
      z.object({
        order_id: z.string(),
        order_date: z.string().nullish(),
        order_content: z.string().nullish(),
        receipt_date: z.string().nullish(),
        sage_entry_id: z.string().nullish(),
        quantity: z.string().nullish(),
        payment: z.string().nullish(),
        observations: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const order = await ctx.prisma.order.create({ data: input });
          return {
            order,
            success: true,
            message: `Commande créée avec succès.`,
          };
        } else {
          return {
            order: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          order: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
