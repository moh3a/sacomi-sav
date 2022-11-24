import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

export const prestationDetailsRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        const count: number = await ctx.prisma.prestationDetails.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
        const prestationDetails = await ctx.prisma.prestationDetails.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          include: { prestation: true },
          orderBy: { id: "desc" },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { prestationDetails, count };
      } else {
        return { prestationDetails: [], count: 0 };
      }
    }),
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.prestationDetails.update({
          where: { id: input.id },
          data: { locked: "LOCKED", locker: ctx.session.user?.name },
        });
        ee.emit("action", "prestationDetails");
      }
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.prestationDetails.update({
          where: { id: input.id },
          data: { locked: "UNLOCKED", locker: "" },
        });
        ee.emit("action", "prestationDetails");
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const prestationDetails = await ctx.prisma.prestationDetails.findUnique(
          {
            where: { id: input.id },
            include: { prestation: true },
          }
        );
        return { prestationDetails };
      } else return { prestationDetails: null };
    }),
  byUnique: t.procedure
    .input(z.object({ prestation_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const prestations = await ctx.prisma.prestationDetails.findMany({
          where: {
            prestationId: { contains: input.prestation_id },
          },
          include: { prestation: true },
          take: 20,
        });
        return { prestations };
      } else return { prestations: null };
    }),
  byRelationId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const rows = await ctx.prisma.prestationDetails.findMany({
          where: {
            prestationId: input.id,
          },
          include: {
            prestation: true,
          },
          take: 20,
        });
        return { rows };
      } else return { rows: null };
    }),
  checkExists: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const prestationDetails = await ctx.prisma.prestationDetails.findUnique(
          {
            where: { id: input.id },
          }
        );
        return {
          exists: prestationDetails ? true : false,
          message: "Prestation existe déjà.",
        };
      } else return { prestationDetails: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          return {
            success: true,
            message: `Prestation créée avec succès.`,
          };
        } else
          return {
            prestation: null,
            success: false,
            message: `Client n'existe pas.`,
          };
      } else {
        return {
          prestation: null,
          success: false,
          message: ERROR_MESSAGES.unauthorized_error,
        };
      }
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          return {
            success: true,
            message: `Prestation modifiée avec succès.`,
          };
        } else {
          return {
            prestation: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          prestation: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
