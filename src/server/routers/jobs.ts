import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

export const jobRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        entry_id: z.string().nullish(),
        entry_date: z.string().nullish(),
        name: z.string().nullish(),
        serial_number: z.string().nullish(),
        technician: z.string().nullish(),
        diagnostics: z.string().nullish(),
        status: z.string().nullish(),
        exit_date: z.string().nullish(),
        product_model: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        if (input.serial_number)
          filters.serial_number = { contains: input.serial_number || "" };
        if (input.exit_date)
          filters.exit_date = { contains: input.exit_date || "" };
        if (input.status) filters.status = { contains: input.status || "" };
        if (input.diagnostics)
          filters.diagnostics = { contains: input.diagnostics || "" };
        if (input.technician)
          filters.technician = { contains: input.technician || "" };
        if (input.name)
          filters.client = { name: { contains: input.name || "" } };
        if (input.entry_id)
          filters.entry = { entry_id: { contains: input.entry_id || "" } };
        if (input.entry_date)
          filters.entry = { entry_date: { contains: input.entry_date || "" } };
        if (input.product_model)
          filters.product = {
            product_model: { contains: input.product_model || "" },
          };

        const count: number = await ctx.prisma.job.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
        const jobs = await ctx.prisma.job.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          include: { client: true, entry: true, product: true },
          orderBy: { job_id: "desc" },
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { jobs, count };
      } else {
        return { jobs: [], count: 0 };
      }
    }),
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.job.update({
          where: { id: input.id },
          data: { locked: "LOCKED", locker: ctx.session.user?.name },
        });
        ee.emit("action", "jobs");
      }
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.job.update({
          where: { id: input.id },
          data: { locked: "UNLOCKED", locker: "" },
        });
        ee.emit("action", "jobs");
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const job = await ctx.prisma.job.findUnique({
          where: { id: input.id },
          include: { client: true, entry: true, product: true },
        });
        return { job };
      } else return { job: null };
    }),
  byUnique: t.procedure
    .input(z.object({ job_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const jobs = await ctx.prisma.job.findMany({
          where: { job_id: input.job_id },
          include: { client: true, entry: true, product: true },
          take: 20,
        });
        return { jobs };
      } else return { jobs: null };
    }),
  byRelationId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const rows = await ctx.prisma.job.findMany({
          where: {
            entryId: input.id,
          },
          include: {
            client: true,
            entry: true,
            product: true,
          },
          take: 20,
        });
        return { rows };
      } else return { rows: null };
    }),
  checkExists: t.procedure
    .input(z.object({ job_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const job = await ctx.prisma.job.findUnique({
          where: { job_id: input.job_id },
        });
        return {
          exists: job ? true : false,
          message: "Cette fiche d'intervention existe déjà.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        job_id: z.number(),
        awaiting_intervention: z.string().nullish(),
        warranty: z.string().nullish(),
        repaired_date: z.any(),
        exit_date: z.any(),
        designation: z.string().nullish(),
        diagnostic: z.string().nullish(),
        status: z.string().nullish(),
        serial_number: z.string().nullish(),
        new_serial_number: z.string().nullish(),
        localisation: z.string().nullish(),
        technician: z.string().nullish(),
        entry_subid: z.number().nullish(),
        product_same_model: z.string().nullish(),
        entry_id: z.string().nullish(),
        product_model: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const entry = await ctx.prisma.entry.findUnique({
            where: { entry_id: input.entry_id! },
            select: { id: true, clientId: true },
          });
          const product = await ctx.prisma.product.findUnique({
            where: { product_model: input.product_model! },
            select: { id: true },
          });
          if (entry && product) {
            delete input.product_model;
            delete input.entry_id;
            input.repaired_date = new Date(input.repaired_date) ?? undefined;
            input.exit_date = new Date(input.exit_date) ?? undefined;
            const job = await ctx.prisma.job.create({
              data: {
                ...input,
                entryId: entry.id,
                clientId: entry.clientId,
                productId: product.id,
              },
            });
            return {
              job,
              success: true,
              message: `Intervention créé avec succès.`,
            };
          } else
            return {
              job: null,
              success: true,
              message: `Entrée, client ou produit n'existe pas.`,
            };
        } else {
          return {
            job: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          job: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        job_id: z.number(),
        awaiting_intervention: z.string().nullish(),
        warranty: z.string().nullish(),
        repaired_date: z.any(),
        exit_date: z.any(),
        designation: z.string().nullish(),
        diagnostic: z.string().nullish(),
        status: z.string().nullish(),
        serial_number: z.string().nullish(),
        new_serial_number: z.string().nullish(),
        localisation: z.string().nullish(),
        technician: z.string().nullish(),
        entry_subid: z.number().nullish(),
        product_same_model: z.string().nullish(),
        name: z.string().nullish(),
        client_name: z.string().nullish(),
        entry_id: z.string().nullish(),
        product_model: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const name = input.name || input.client_name;
          const entry_id = input.entry_id ?? "";
          const product_model = input.product_model ?? "";
          delete input.client_name;
          delete input.name;
          delete input.entry_id;
          delete input.product_model;
          input.repaired_date = new Date(input.repaired_date) ?? undefined;
          input.exit_date = new Date(input.exit_date) ?? undefined;
          const client = await ctx.prisma.client.findUnique({
            where: { name: name ?? "" },
            select: { id: true },
          });
          const product = await ctx.prisma.product.findUnique({
            where: { product_model },
            select: { id: true },
          });
          if (client) {
            const entry = await ctx.prisma.entry.update({
              where: { entry_id },
              data: {
                client: {
                  connect: {
                    id: client.id,
                  },
                },
              },
            });
            if (entry && product) {
              await ctx.prisma.job.updateMany({
                where: {
                  entryId: entry.id,
                },
                data: {
                  clientId: client.id,
                },
              });
              const job = await ctx.prisma.job.update({
                where: { id: input.id },
                data: {
                  product: {
                    connect: {
                      id: product.id,
                    },
                  },
                  ...input,
                },
              });
              return {
                job,
                success: true,
                message: `Intervention modifiéé avec succès.`,
              };
            } else {
              return {
                job: null,
                success: false,
                message: "Problème avec le client ou le modèle du produit.",
              };
            }
          }
        } else {
          return {
            job: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          job: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
