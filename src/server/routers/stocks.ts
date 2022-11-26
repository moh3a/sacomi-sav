import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

export const stockRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        const count = await ctx.prisma.stock.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
        const stocks = await ctx.prisma.stock.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          include: { part: { include: { product: true } } },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { stocks, count };
      } else {
        return { stocks: [], count: 0 };
      }
    }),
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.stock.update({
            where: { id: input.id },
            data: { locked: "LOCKED", locker: ctx.session.user?.name },
          });
          ee.emit("action", "stocks");
        }
      } catch (error) {}
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.stock.update({
            where: { id: input.id },
            data: { locked: "UNLOCKED", locker: "" },
          });
          ee.emit("action", "stocks");
        }
      } catch (error) {}
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const stock = await ctx.prisma.stock.findUnique({
          where: { id: input.id },
        });
        return { stock };
      } else return { stock: null };
    }),
  byUnique: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const stocks = await ctx.prisma.stock.findMany({
          where: { part: { name: input.name } },
          take: 20,
        });
        return { stocks };
      } else return { stocks: null };
    }),
  checkExists: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const client = await ctx.prisma.client.findUnique({
          where: { name: input.name.toUpperCase() },
        });
        return {
          exists: client ? true : false,
          message: "Client existe déjà.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        name: z.string().nullish(),
        description: z.string().nullish(),
        product_model: z.string().nullish(),
        quantity: z.number().nullish(),
        ok: z.number().nullish(),
        hs: z.number().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const part = await ctx.prisma.part.findUnique({
            where: { name: input.name ?? "" },
          });
          if (part) {
            delete input.name;
            delete input.description;
            delete input.product_model;
            const stock = await ctx.prisma.stock.create({
              data: { partId: part.id, ...input },
            });
            return {
              stock,
              success: true,
              message: `Elément stocké avec succès.`,
            };
          } else
            return {
              stock: null,
              success: false,
              message: "Cette pièce n'existe pas.",
            };
        } else {
          return {
            product: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          stock: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
  update: t.procedure
    .input(
      z.object({
        name: z.string().nullish(),
        description: z.string().nullish(),
        product_model: z.string().nullish(),
        quantity: z.number().nullish(),
        ok: z.number().nullish(),
        hs: z.number().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          return {
            success: false,
            message: `Elément ne peut pas être modifié.`,
          };
        } else {
          return {
            product: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          stock: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
