import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

export const transactionRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        date: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const autodate = new Date().toISOString().substring(0, 8);
        input.date = input.date ?? undefined;
        const transactions = await ctx.prisma.transaction.findMany({
          where: {
            date: {
              lte: input.date
                ? new Date(input.date + "-31")
                : new Date(autodate + "31"),
              gte: input.date
                ? new Date(input.date + "-01")
                : new Date(autodate + "01"),
            },
          },
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
        const count = await ctx.prisma.transaction.count({
          where: {
            date: {
              lte: input.date
                ? new Date(input.date + "-31")
                : new Date(autodate + "31"),
              gte: input.date
                ? new Date(input.date + "-01")
                : new Date(autodate + "01"),
            },
          },
        });
        return { transactions, count };
      } else {
        return { transactions: [], count: 0 };
      }
    }),
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.transaction.update({
            where: { id: input.id },
            data: { locked: "LOCKED", locker: ctx.session.user?.name },
          });
          ee.emit("action", "transactions");
        }
      } catch (error) {}
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.transaction.update({
            where: { id: input.id },
            data: { locked: "UNLOCKED", locker: "" },
          });
          ee.emit("action", "transactions");
        }
      } catch (error) {}
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const transaction = await ctx.prisma.transaction.findUnique({
          where: { id: input.id },
          include: {
            prestation: {
              include: {
                client: true,
              },
            },
          },
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
          include: {
            prestation: {
              include: {
                client: true,
              },
            },
          },
          take: 20,
        });
        return { transactions };
      } else return { transactions: null };
    }),
  checkExists: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const transaction = await ctx.prisma.transaction.findUnique({
          where: { id: input.id },
        });
        return {
          exists: transaction ? true : false,
          message: "Cette transaction existe d??j??.",
        };
      } else return { exists: null, message: "" };
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
            message: `Transaction cr????e avec succ??s.`,
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
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
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
            prestationId =
              (
                await ctx.prisma.prestation.findUnique({
                  where: { prestation_id: input.prestation_id.toUpperCase() },
                  select: { id: true },
                })
              )?.id ?? undefined;

          delete input.prestation_id;
          const transaction = await ctx.prisma.transaction.findUnique({
            where: { id: input.id },
          });
          if (transaction) {
            if (transaction.type === "INCOME") {
              await ctx.prisma.config.update({
                where: { id: "config" },
                data: { current_balance: { decrement: transaction.amount } },
              });
            } else if (transaction.type === "EXPENSE") {
              await ctx.prisma.config.update({
                where: { id: "config" },
                data: { current_balance: { increment: transaction.amount } },
              });
            }
          }

          const newtransaction = await ctx.prisma.transaction.update({
            where: { id: input.id },
            data: { ...input, prestationId },
          });
          if (newtransaction) {
            if (newtransaction.type === "INCOME") {
              await ctx.prisma.config.update({
                where: { id: "config" },
                data: { current_balance: { increment: newtransaction.amount } },
              });
            } else if (newtransaction.type === "EXPENSE") {
              await ctx.prisma.config.update({
                where: { id: "config" },
                data: { current_balance: { decrement: newtransaction.amount } },
              });
            }
          }

          return {
            transaction,
            success: true,
            message: `Transaction modifi??e avec succ??s.`,
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
