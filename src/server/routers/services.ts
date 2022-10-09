import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";

export const prestationRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        prestation_id: z.string().nullish(),
        prestation_date: z.string().nullish(),
        name: z.string().nullish(),
        is_paid: z.string().nullish(),
        payment_date: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        if (input.prestation_id)
          filters = {
            ...filters,
            prestation_id: { contains: input.prestation_id || "" },
          };
        if (input.prestation_date)
          filters = {
            ...filters,
            prestation_date: { contains: input.prestation_date || "" },
          };
        if (input.is_paid)
          filters = {
            ...filters,
            is_paid: { contains: input.is_paid || "" },
          };
        if (input.payment_date)
          filters = {
            ...filters,
            payment_date: { contains: input.payment_date || "" },
          };
        if (input.name)
          filters = {
            ...filters,
            client: { name: { contains: input.name || "" } },
          };
        const count: number = await ctx.prisma.prestation.count();
        const prestations = await ctx.prisma.prestation.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          include: { client: true, _count: true },
          orderBy: { id: "desc" },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { prestations, count };
      } else {
        return { prestations: [], count: 0 };
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const prestation = await ctx.prisma.prestation.findUnique({
          where: { id: input.id },
          include: { client: true, _count: true },
        });
        return { prestation };
      } else return { prestation: null };
    }),
  byUnique: t.procedure
    .input(z.object({ prestation_id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const prestation = await ctx.prisma.prestation.findUnique({
          where: { prestation_id: input.prestation_id },
          include: { client: true, _count: true },
        });
        return { prestation };
      } else return { prestation: null };
    }),
  create: t.procedure
    .input(
      z.object({
        prestation_id: z.string(),
        prestation_date: z.string().nullish(),
        is_paid: z.string().nullish(),
        to_bill: z.string().nullish(),
        recovery_date: z.string().nullish(),
        payment_date: z.string().nullish(),
        total_amount: z.string().nullish(),
        invoice: z.string().nullish(),
        client_name: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const client = await ctx.prisma.client.findUnique({
            where: { name: input.client_name! },
            select: { id: true },
          });
          if (client) {
            delete input.client_name;
            const prestation = await ctx.prisma.prestation.create({
              data: { ...input, clientId: client.id },
            });
            return {
              prestation,
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
      } else
        return {
          prestation: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
