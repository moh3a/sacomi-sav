import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";

export const entryRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        name: z.string().nullish(),
        entry_id: z.string().nullish(),
        entry_date: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let entry_filters: any = {};
        if (input.name)
          entry_filters = {
            ...entry_filters,
            client: { name: { contains: input.name || "" } },
          };
        if (input.entry_id)
          entry_filters = {
            ...entry_filters,
            entry_id: { contains: input.entry_id || "" },
          };
        if (input.entry_date)
          entry_filters = { ...entry_filters, entry_date: input.entry_date };
        const entries = await ctx.prisma.entry.findMany({
          where:
            Object.keys(entry_filters).length > 0 ? entry_filters : undefined,
          include: { client: true, _count: true },
          orderBy: { id: "desc" },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        const count: number = await ctx.prisma.entry.count();
        return { entries, count };
      } else {
        return { entries: [], count: 0 };
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const entry = await ctx.prisma.entry.findUnique({
          where: { id: input.id },
          include: { client: true, _count: true },
        });
        return { entry };
      } else return { entry: null };
    }),
  byUnique: t.procedure
    .input(z.object({ entry_id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const entry = await ctx.prisma.entry.findUnique({
          where: { entry_id: input.entry_id },
          include: { client: true, _count: true },
        });
        return { entry };
      } else return { entry: null };
    }),
  create: t.procedure
    .input(
      z.object({
        entry_id: z.string(),
        entry_date: z.string().nullish(),
        entry_time: z.string().nullish(),
        warranty: z.string().nullish(),
        global: z.string().nullish(),
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
            if (!input.entry_date)
              input.entry_date = new Date().toISOString().substring(0, 10);
            if (!input.entry_time)
              input.entry_time = new Date().toISOString().substring(11, 16);
            delete input.client_name;
            const entry = await ctx.prisma.entry.create({
              data: { ...input, clientId: client.id },
            });
            await ctx.prisma.config.update({
              where: {
                id: "config",
              },
              data: { current_entries_id: input.entry_id },
            });
            return {
              entry,
              success: true,
              message: `Entrée créée avec succès.`,
            };
          } else
            return {
              entry: null,
              success: false,
              message: `Client n'existe pas.`,
            };
        } else
          return {
            entry: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
      } else
        return {
          entry: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
