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
        const count: number = await ctx.prisma.prestation.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
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
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const prestations = await ctx.prisma.prestation.findMany({
          where: {
            prestation_id: { contains: input.prestation_id.toUpperCase() },
          },
          include: { client: true, _count: true },
          take: 20,
        });
        return { prestations };
      } else return { prestations: null };
    }),
  checkExists: t.procedure
    .input(z.object({ prestation_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const prestation = await ctx.prisma.prestation.findUnique({
          where: { prestation_id: input.prestation_id.toUpperCase() },
        });
        return {
          exists: prestation ? true : false,
          message: "Prestation existe déjà.",
        };
      } else return { exists: null, message: "" };
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
        rows: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          let services = JSON.parse(JSON.stringify(input.rows));

          const client = await ctx.prisma.client.findUnique({
            where: { name: input.client_name! },
            select: { id: true },
          });
          if (client) {
            if (!input.prestation_date)
              input.prestation_date = new Date().toISOString().substring(0, 10);
            delete input.client_name;
            delete input.rows;
            const prestation = await ctx.prisma.prestation.create({
              data: { ...input, clientId: client.id },
            });
            await ctx.prisma.config.update({
              where: { id: "config" },
              data: { current_prestations_id: prestation.prestation_id },
            });

            let get_details = async () => {
              if (prestation && services) {
                for (let service of services) {
                  if (service.designation) {
                    service = Object.keys(service).map((key) =>
                      String(service[key])
                    );
                    await ctx.prisma.prestationDetails.create({
                      data: {
                        prestationId: prestation.id,
                        ...service,
                      },
                    });
                  }
                }
              }
            };
            await get_details();
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
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        prestation_id: z.string(),
        prestation_date: z.string().nullish(),
        is_paid: z.string().nullish(),
        to_bill: z.string().nullish(),
        recovery_date: z.string().nullish(),
        payment_date: z.string().nullish(),
        total_amount: z.string().nullish(),
        invoice: z.string().nullish(),
        client_name: z.string().nullish(),
        rows: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          let services = JSON.parse(JSON.stringify(input.rows));
          const client = await ctx.prisma.client.findUnique({
            where: { name: input.client_name ?? "" },
            select: { id: true },
          });
          if (client) {
            delete input.rows;
            delete input.client_name;
            const prestation = await ctx.prisma.prestation.update({
              where: { id: input.id },
              data: { ...input, clientId: client.id },
            });

            let update_details = async () => {
              if (prestation && services) {
                for (let service of services) {
                  if (service.designation) {
                    service = Object.keys(service).map((key) =>
                      String(service[key])
                    );
                    await ctx.prisma.prestationDetails.upsert({
                      where: { id: service.id },
                      update: {
                        prestationId: prestation.id,
                        ...service,
                      },
                      create: {
                        prestation: {
                          connect: { id: prestation.id },
                        },
                        ...service,
                      },
                    });
                  }
                }
              }
            };
            await update_details();

            return {
              prestation,
              success: true,
              message: `Prestation modifiée avec succès.`,
            };
          }
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
