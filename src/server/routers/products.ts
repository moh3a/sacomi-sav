import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";
import { ee } from "./_app";

export const productRouter = t.router({
  all: t.procedure
    .input(
      z.object({
        p: z.number(),
        product_model: z.string().nullish(),
        product_brand: z.string().nullish(),
        product_type: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        let filters: any = {};
        if (input.product_model)
          filters = {
            ...filters,
            product_model: { contains: input.product_model || "" },
          };
        if (input.product_brand)
          filters = {
            ...filters,
            product_brand: { contains: input.product_brand || "" },
          };
        if (input.product_type)
          filters = {
            ...filters,
            product_type: { contains: input.product_type || "" },
          };
        const count = await ctx.prisma.product.count({
          where: Object.keys(filters).length > 0 ? filters : undefined,
        });
        const products = await ctx.prisma.product.findMany({
          where: Object.keys(filters).length > 0 ? filters : undefined,
          skip: input.p * ITEMS_PER_PAGE,
          include: { parts: true },
          take: ITEMS_PER_PAGE,
        });
        return { products, count };
      } else {
        return { products: [], count: 0 };
      }
    }),
  lock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.product.update({
            where: { id: input.id },
            data: { locked: "LOCKED", locker: ctx.session.user?.name },
          });
          ee.emit("action", "products");
        }
      } catch (error) {}
    }),
  unlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session) {
          await ctx.prisma.product.update({
            where: { id: input.id },
            data: { locked: "UNLOCKED", locker: "" },
          });
          ee.emit("action", "products");
        }
      } catch (error) {}
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const product = await ctx.prisma.product.findUnique({
          where: { id: input.id },
          include: { parts: true },
        });
        return { product };
      } else return { product: null };
    }),
  byUnique: t.procedure
    .input(z.object({ product_model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const products = await ctx.prisma.product.findMany({
          where: {
            product_model: { contains: input.product_model.toUpperCase() },
          },
          include: { parts: true },
          take: 20,
        });
        return { products };
      } else return { products: null };
    }),
  checkExists: t.procedure
    .input(z.object({ product_model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const product = await ctx.prisma.product.findUnique({
          where: { product_model: input.product_model.toUpperCase() },
        });
        return {
          exists: product ? true : false,
          message: "Produit existe déjà.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        product_model: z.string(),
        product_type: z.string().nullish(),
        product_brand: z.string().nullish(),
        rows: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          let parts = JSON.parse(JSON.stringify(input.rows));
          delete input.rows;
          const product = await ctx.prisma.product.create({ data: input });

          let get_parts = async () => {
            if (parts) {
              for (let part of parts) {
                if (part.name) {
                  await ctx.prisma.part.create({
                    data: { productId: product.id, ...part },
                  });
                }
              }
            }
          };
          await get_parts();

          return {
            product,
            success: true,
            message: `Produit créé avec succès.`,
          };
        } else {
          return {
            product: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          product: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        product_model: z.string(),
        product_type: z.string().nullish(),
        product_brand: z.string().nullish(),
        rows: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          let parts = JSON.parse(JSON.stringify(input.rows));
          delete input.rows;
          const product = await ctx.prisma.product.update({
            where: { id: input.id },
            data: input,
          });
          const update_parts = async () => {
            if (parts) {
              for (let part of parts) {
                if (part.name) {
                  part.productId = product.id;
                  await ctx.prisma.part.upsert({
                    where: {
                      name: part.name,
                    },
                    update: part,
                    create: part,
                  });
                }
              }
            }
          };
          await update_parts();

          return {
            product,
            success: true,
            message: `Produit modifié avec succès.`,
          };
        } else {
          return {
            product: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          product: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
