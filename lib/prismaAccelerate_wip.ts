import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const datasources = {
  db: {
    url: process.env.MIDDLEWARE_DATABASE_URL,
  },
};

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
    datasources,
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') global.prisma = prisma as PrismaClient;

export default prisma;
