import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";

export const clientRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        name: z.string().nullish(),
        type: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        if (input.name)
          filters = { ...filters, name: { contains: input.name || "" } };
        if (input.type)
          filters = { ...filters, type: { contains: input.type || "" } };
        const count = await ctx.prisma.client.count();
        const clients = await ctx.prisma.client.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { clients, count };
      } else {
        return { clients: [], count: 0 };
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const client = await ctx.prisma.client.findUnique({
          where: { id: input.id },
        });
        return { client };
      } else return { client: null };
    }),
  byUnique: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const clients = await ctx.prisma.client.findMany({
          where: { name: { contains: input.name.toUpperCase() } },
          take: 20,
        });
        return { clients };
      } else return { clients: null };
    }),
  clientExists: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const client = await ctx.prisma.client.findUnique({
          where: { name: input.name.toUpperCase() },
        });
        return { exists: client ? true : false };
      } else return { exists: null };
    }),
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        type: z.string().nullish(),
        status: z.string().nullish(),
        phone_number: z.string().nullish(),
        contact: z.string().nullish(),
        address: z.string().nullish(),
        wilaya: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const client = await ctx.prisma.client.create({ data: input });
          return {
            client,
            success: true,
            message: `Client créé avec succès.`,
          };
        } else {
          return {
            client: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          client: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
