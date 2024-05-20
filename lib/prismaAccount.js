import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client/edge';

const prisma = (url) => {
  if (!url) {
    return null;
  }
  let prisma;
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `${url}`,
        },
      },
    }).$extends(withAccelerate());
  } else {
    if (!global.prismaAccount) {
      prisma = new PrismaClient({
        log: [
          {
            emit: 'event',
            level: 'query',
          },
        ],
        datasources: {
          db: {
            url: `${url}`,
          },
        },
      }).$extends(withAccelerate());
    }
    global.prismaAccount = prisma;
  }
  return prisma;
};

/*
prisma.$on("query", async (e) => {
  console.log(`On Query -> ${e.query} ${e.params}`)
})
*/

export default prisma;
