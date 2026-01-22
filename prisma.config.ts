// prisma.config.ts (optionnel pour ton code, Prisma CLI n'en a pas besoin)
import "dotenv/config";

export const prismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
