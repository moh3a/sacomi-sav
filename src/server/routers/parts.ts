import { z } from "zod";
import { ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

export const partRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        const count = await ctx.prisma.part.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
        const parts = await ctx.prisma.part.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          include: { product: true },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { parts, count };
      } else {
        return { parts: [], count: 0 };
      }
    }),
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          // await ctx.prisma.part.update({
          //   where: { id: input.id },
          //   data: { locked: "LOCKED", locker: ctx.session.user?.name },
          // });
          ee.emit("action", "stocks");
        }
      } catch (error) {}
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          // await ctx.prisma.part.update({
          //   where: { id: input.id },
          //   data: { locked: "UNLOCKED", locker: "" },
          // });
          ee.emit("action", "stocks");
        }
      } catch (error) {}
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const part = await ctx.prisma.part.findUnique({
          where: { id: input.id },
          include: { product: true },
        });
        return { part };
      } else return { part: null };
    }),
  byUnique: t.procedure
    .input(
      z.object({
        name: z.string().nullish(),
        product_model: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const parts = await ctx.prisma.part.findMany({
          where: {
            name: input.name ?? undefined,
            product: { product_model: input.product_model ?? undefined },
          },
          include: { product: true },
          take: 20,
        });
        return { parts };
      } else return { parts: null };
    }),
  byRelationId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const rows = await ctx.prisma.part.findMany({
          where: {
            productId: input.id,
          },
          include: { product: true },
          take: 20,
        });
        return { rows };
      } else return { rows: null };
    }),
  checkExists: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const part = await ctx.prisma.part.findFirst({
          where: { name: input.name.toUpperCase() },
        });
        return {
          exists: part ? true : false,
          message: "Piece existe déjà.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure.mutation(async ({ ctx, input }) => {
    if (ctx.session) {
      return {
        success: true,
        message: `Piece stockée avec succès.`,
      };
    }
  }),
  update: t.procedure.mutation(async ({ ctx, input }) => {
    if (ctx.session) {
      return {
        success: true,
        message: `Piece modifiée avec succès.`,
      };
    }
  }),
});
