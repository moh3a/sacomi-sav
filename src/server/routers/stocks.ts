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
  //   lock: t.procedure
  //     .input(z.object({ id: z.string() }))
  //     .mutation(async ({ ctx, input }) => {
  //       if (ctx.session) {
  //         await ctx.prisma.stock.update({
  //           where: { id: input.id },
  //           data: { locked: true, locker: ctx.session.user?.name },
  //         });
  //         ee.emit("action", "stocks");
  //       }
  //     }),
  //   unlock: t.procedure
  //     .input(z.object({ id: z.string() }))
  //     .mutation(async ({ ctx, input }) => {
  //       if (ctx.session) {
  //         await ctx.prisma.stock.update({
  //           where: { id: input.id },
  //           data: { locked: false, locker: "" },
  //         });
  //         ee.emit("action", "stocks");
  //       }
  //     }),
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
});
