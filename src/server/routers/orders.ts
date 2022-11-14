import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

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
        const count = await ctx.prisma.order.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
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
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.order.update({
          where: { id: input.id },
          data: { locked: true, locker: ctx.session.user?.name },
        });
        ee.emit("action", "orders");
      }
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.order.update({
          where: { id: input.id },
          data: { locked: false, locker: "" },
        });
        ee.emit("action", "orders");
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
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const orders = await ctx.prisma.order.findMany({
          where: { order_id: { contains: input.order_id.toUpperCase() } },
          take: 20,
        });
        return { orders };
      } else return { orders: null };
    }),
  checkExists: t.procedure
    .input(z.object({ order_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const order = await ctx.prisma.order.findUnique({
          where: { order_id: input.order_id.toUpperCase() },
        });
        return {
          exists: order ? true : false,
          message: "Bon de commande existe déjà.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        order_id: z.string(),
        order_date: z.any(),
        order_content: z.string().nullish(),
        receipt_date: z.any(),
        sage_entry_id: z.string().nullish(),
        quantity: z.number().nullish(),
        payment: z.string().nullish(),
        observations: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          input.order_date = new Date(input.order_date) ?? undefined;
          input.receipt_date = new Date(input.receipt_date) ?? undefined;
          const order = await ctx.prisma.order.create({ data: input });
          await ctx.prisma.config.update({
            where: { id: "config" },
            data: { current_orders_id: order.order_id },
          });
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
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        order_id: z.string(),
        order_date: z.any(),
        order_content: z.string().nullish(),
        receipt_date: z.any(),
        sage_entry_id: z.string().nullish(),
        quantity: z.number().nullish(),
        payment: z.string().nullish(),
        observations: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          input.order_date = new Date(input.order_date) ?? undefined;
          input.receipt_date = new Date(input.receipt_date) ?? undefined;
          const order = await ctx.prisma.order.update({
            where: { id: input.id },
            data: input,
          });
          return {
            order,
            success: true,
            message: `Commande modifiée avec succès.`,
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
