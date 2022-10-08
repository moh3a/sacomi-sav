import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

prisma.$use(async (params, next) => {
  if (
    (params.action === "create" || params.action === "createMany") &&
    params.model === "User"
  ) {
    const salt = await genSalt(10);
    params.args.data.password = await hash(params.args.data.password, salt);
  }
  return next(params);
});

if (process.env.NODE_ENV === "development") global.prisma = prisma;
export default prisma;
