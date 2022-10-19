import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";

export const transactionRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        const count = await ctx.prisma.client.count();
        const transactions = await ctx.prisma.transaction.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          include: {
            prestation: {
              include: {
                client: true,
              },
            },
          },
          orderBy: { id: "desc" },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { transactions, count };
      } else {
        return { transactions: [], count: 0 };
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const transaction = await ctx.prisma.transaction.findUnique({
          where: { id: input.id },
        });
        return { transaction };
      } else return { transaction: null };
    }),
  byUnique: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const transactions = await ctx.prisma.transaction.findMany({
          where: { type: "EXPENSE" },
          take: 20,
        });
        return { transactions };
      } else return { transactions: null };
    }),
  create: t.procedure
    .input(
      z.object({
        prestation_id: z.string().nullish(),
        title: z.string().nullish(),
        type: z.enum(["INCOME", "EXPENSE", "CHEQUE"]),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          let prestationId: string | undefined = undefined;
          if (input.prestation_id)
            prestationId = (
              await ctx.prisma.prestation.findUnique({
                where: { prestation_id: input.prestation_id.toUpperCase() },
                select: { id: true },
              })
            )?.id;

          delete input.prestation_id;
          const transaction = await ctx.prisma.transaction.create({
            data: {
              prestationId,
              ...input,
            },
          });
          if (transaction.type === "EXPENSE") {
            await ctx.prisma.config.update({
              where: { id: "config" },
              data: { current_balance: { decrement: transaction.amount } },
            });
          }
          if (transaction.type === "INCOME") {
            await ctx.prisma.config.update({
              where: { id: "config" },
              data: { current_balance: { increment: transaction.amount } },
            });
          }
          return {
            transaction,
            success: true,
            message: `Transaction créée avec succès.`,
          };
        } else {
          return {
            transaction: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          transaction: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
