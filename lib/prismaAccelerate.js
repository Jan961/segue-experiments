import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '@prisma/client/edge';

let prisma;

const datasources = {
  db: {
    url: process.env.MIDDLEWARE_DATABASE_URL,
  },
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources,
  }).$extends(withAccelerate());
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
        log: [
          {
            emit: 'event',
            level: 'query',
          },
        ],
        datasources,
      }).$extends(withAccelerate());
  }
  prisma = global.prisma;
}

/*
prisma.$on("query", async (e) => {
  console.log(`On Query -> ${e.query} ${e.params}`)
})
*/

export default prisma;