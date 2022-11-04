import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";

export const deliveryRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        delivery_id: z.string().nullish(),
        delivery_date: z.string().nullish(),
        name: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        if (input.delivery_id)
          filters = {
            ...filters,
            delivery_id: { contains: input.delivery_id || "" },
          };
        if (input.delivery_date)
          filters = {
            ...filters,
            delivery_date: { contains: input.delivery_date || "" },
          };
        if (input.name)
          filters = {
            ...filters,
            client: { name: { contains: input.name || "" } },
          };
        const count = await ctx.prisma.delivery.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
        const deliveries = await ctx.prisma.delivery.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          include: { client: true },
          orderBy: { id: "desc" },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { deliveries, count };
      } else {
        return { deliveries: [], count: 0 };
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const delivery = await ctx.prisma.delivery.findUnique({
          where: { id: input.id },
          include: { client: true },
        });
        return { delivery };
      } else return { delivery: null };
    }),
  byUnique: t.procedure
    .input(z.object({ delivery_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const deliveries = await ctx.prisma.delivery.findMany({
          where: { delivery_id: { contains: input.delivery_id.toUpperCase() } },
          include: { client: true },
          take: 20,
        });
        return { deliveries };
      } else return { deliveries: null };
    }),
  checkExists: t.procedure
    .input(z.object({ delivery_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const delivery = await ctx.prisma.delivery.findUnique({
          where: { delivery_id: input.delivery_id.toUpperCase() },
        });
        return {
          exists: delivery ? true : false,
          message: "Bon de livraison existe déjà.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        delivery_id: z.string(),
        delivery_date: z.any(),
        entry_id: z.string().nullish(),
        sage_exit_id: z.string().nullish(),
        date_delivered: z.any(),
        observations: z.string().nullish(),
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
            input.delivery_date = input.delivery_date
              ? new Date(input.delivery_date)
              : new Date();
            input.date_delivered = new Date(input.date_delivered) ?? undefined;

            delete input.client_name;
            const delivery = await ctx.prisma.delivery.create({
              data: { ...input, clientId: client.id },
            });
            await ctx.prisma.config.update({
              where: { id: "config" },
              data: { current_deliveries_id: delivery.delivery_id },
            });
            return {
              delivery,
              success: true,
              message: `Livraison créée avec succès.`,
            };
          } else
            return {
              delivery: null,
              success: false,
              message: `Client n'existe pas.`,
            };
        } else {
          return {
            delivery: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          delivery: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        delivery_id: z.string(),
        delivery_date: z.any(),
        entry_id: z.string().nullish(),
        sage_exit_id: z.string().nullish(),
        date_delivered: z.any(),
        observations: z.string().nullish(),
        client_name: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const client = await ctx.prisma.client.findUnique({
            where: { name: input.client_name ?? "" },
            select: { id: true },
          });
          if (client) {
            delete input.client_name;
            input.date_delivered = new Date(input.date_delivered);

            const delivery = await ctx.prisma.delivery.update({
              where: { id: input.id },
              data: { ...input, clientId: client.id },
            });
            return {
              delivery,
              success: true,
              message: `Livraison modifiée avec succès.`,
            };
          }
        } else {
          return {
            delivery: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          delivery: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
