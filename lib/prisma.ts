import { PrismaClient } from "@prisma/client";

// Prevents "too many Prisma Client instances" errors during Next.js
// dev hot-reloading, by caching the client on the global object.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
