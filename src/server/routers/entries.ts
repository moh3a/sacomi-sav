import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

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
        const count: number = await ctx.prisma.entry.count({
          where:
            Object.keys(entry_filters).length > 0 ? entry_filters : undefined,
        });
        return { entries, count };
      } else {
        return { entries: [], count: 0 };
      }
    }),
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.entry.update({
            where: { id: input.id },
            data: { locked: "LOCKED", locker: ctx.session.user?.name },
          });
          ee.emit("action", "entries");
        }
      } catch (error) {}
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.entry.update({
            where: { id: input.id },
            data: { locked: "UNLOCKED", locker: "" },
          });
          ee.emit("action", "entries");
        }
      } catch (error) {}
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
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const entries = await ctx.prisma.entry.findMany({
          where: { entry_id: { contains: input.entry_id.toUpperCase() } },
          include: { client: true, _count: true },
          take: 20,
        });
        return { entries };
      } else return { entries: null };
    }),
  checkExists: t.procedure
    .input(z.object({ entry_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const entry = await ctx.prisma.entry.findUnique({
          where: { entry_id: input.entry_id.toUpperCase() },
        });
        return {
          exists: entry ? true : false,
          message: "Bon d'entr??e existe d??j??.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        entry_id: z.string(),
        entry_date: z.any(),
        entry_time: z.string().nullish(),
        client_name: z.string().nullish(),
        rows: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          let products = JSON.parse(JSON.stringify(input.rows));
          const client = await ctx.prisma.client.findUnique({
            where: { name: input.client_name ?? "" },
            select: { id: true },
          });
          if (client) {
            input.entry_date = input.entry_date
              ? new Date(input.entry_date)
              : new Date();
            if (!input.entry_time)
              input.entry_time = new Date().toISOString().substring(11, 16);
            delete input.client_name;
            delete input.rows;
            const entry = await ctx.prisma.entry.create({
              data: { ...input, clientId: client.id },
            });

            let get_jobs = async () => {
              if (products) {
                for (let product of products) {
                  if (product.product_model) {
                    const p = await ctx.prisma.product.findUnique({
                      where: { product_model: product.product_model },
                      select: { id: true },
                    });
                    const config = await ctx.prisma.config.findFirst({
                      select: { current_jobs_id: true },
                    });
                    if (p && config) {
                      delete product.product_model;
                      await ctx.prisma.job.create({
                        data: {
                          job_id: config.current_jobs_id + 1,
                          clientId: client.id,
                          productId: p.id,
                          entryId: entry.id,
                          ...product,
                        },
                      });
                      await ctx.prisma.config.update({
                        where: {
                          id: "config",
                        },
                        data: { current_jobs_id: config.current_jobs_id + 1 },
                      });
                    }
                  }
                }
              }
            };
            await get_jobs();

            await ctx.prisma.config.update({
              where: {
                id: "config",
              },
              data: { current_entries_id: input.entry_id },
            });
            return {
              entry,
              success: true,
              message: `Entr??e cr????e avec succ??s.`,
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
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        entry_id: z.string(),
        entry_date: z.any(),
        entry_time: z.string().nullish(),
        client_name: z.string().nullish(),
        rows: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          let products = JSON.parse(JSON.stringify(input.rows));
          const client = await ctx.prisma.client.findUnique({
            where: { name: input.client_name ?? "" },
            select: { id: true },
          });
          if (client) {
            delete input.rows;
            delete input.client_name;
            input.entry_date = new Date(input.entry_date) ?? undefined;
            const entry = await ctx.prisma.entry.update({
              where: { id: input.id },
              data: { ...input, clientId: client.id },
            });

            let update_jobs = async () => {
              if (products) {
                for (let product of products) {
                  if (product.product_model) {
                    const p = await ctx.prisma.product.findUnique({
                      where: { product_model: product.product_model },
                      select: { id: true },
                    });
                    const config = await ctx.prisma.config.update({
                      where: { id: "config" },
                      data: {
                        current_jobs_id: {
                          increment: 1,
                        },
                      },
                      select: { current_jobs_id: true },
                    });
                    delete product.product_model;
                    if (p && config) {
                      if (product.id) {
                        await ctx.prisma.job.update({
                          where: { id: product.id },
                          data: {
                            clientId: client.id,
                            productId: p.id,
                            entryId: entry.id,
                            ...product,
                          },
                        });
                      } else {
                        await ctx.prisma.job.create({
                          data: {
                            clientId: client.id,
                            productId: p.id,
                            entryId: entry.id,
                            job_id: config.current_jobs_id,
                            ...product,
                          },
                        });
                      }
                    }
                  }
                }
              }
            };
            await update_jobs();

            return {
              entry,
              success: true,
              message: `Entr??e modifi??e avec succ??s.`,
            };
          }
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
