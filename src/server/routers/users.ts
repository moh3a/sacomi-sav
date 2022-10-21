import { genSaltSync, hashSync } from "bcrypt";
import { z } from "zod";
import { ERROR_MESSAGES, ITEMS_PER_PAGE } from "../../../lib/config";
import { t } from "../trpc";

export const userRouter = t.router({
  all: t.procedure
    .input(z.object({ p: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const count = await ctx.prisma.user.count();
        const users = await ctx.prisma.user.findMany({
          skip: input.p * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
        });
        return { users, count };
      } else {
        return { users: [], count: 0 };
      }
    }),
  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: input.id },
        });
        return { user };
      } else return { user: null };
    }),
  byUnique: t.procedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const users = await ctx.prisma.user.findMany({
          where: { username: input.username },
        });
        return { users };
      } else return { users: null };
    }),
  checkExists: t.procedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        const user = await ctx.prisma.user.findUnique({
          where: { username: input.username },
        });
        return {
          exists: user ? true : false,
          message: "Cet utilisateur existe déjà.",
        };
      } else return { exists: null, message: "" };
    }),
  create: t.procedure
    .input(
      z.object({
        username: z.string(),
        email: z.string().nullish(),
        fullName: z.string().nullish(),
        password: z.string(),
        image: z.string().nullish(),
        role: z.enum(["ADMIN", "RECEPTION", "TECHNICIAN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          input.image = `https://avatars.dicebear.com/api/bottts/${input.username}.svg`;
          const salt = genSaltSync();
          input.password = hashSync(input.password, salt);
          const member = await ctx.prisma.user.create({ data: input });
          return {
            member,
            success: true,
            message: `Personnel créé avec succès.`,
          };
        } else {
          return {
            member: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          member: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        username: z.string(),
        email: z.string().nullish(),
        fullName: z.string().nullish(),
        image: z.string().nullish(),
        role: z.enum(["ADMIN", "RECEPTION", "TECHNICIAN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        if (ctx.session.user?.role === "ADMIN") {
          const member = await ctx.prisma.user.update({
            where: { id: input.id },
            data: input,
          });
          return {
            member,
            success: true,
            message: `Personnel modifié avec succès.`,
          };
        } else {
          return {
            member: null,
            success: false,
            message: ERROR_MESSAGES.unauthorized_error,
          };
        }
      } else
        return {
          member: null,
          success: false,
          message: ERROR_MESSAGES.session_error,
        };
    }),
});
