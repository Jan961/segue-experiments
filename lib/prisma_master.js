import { PrismaClient } from 'prisma/generated/prisma-master';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prismaMaster) {
    global.prismaMaster = new PrismaClient({
      datasourceUrl: process.env.MASTER_DATABASE_URL,
      transactionOptions: {
        isolationLevel: 'Serializable',
        maxWait: 4000, // default: 2000
        timeout: 5000, // default: 5000
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }
  prisma = global.prismaMaster;
}

// prisma.$on("query", async (e) => {
//   console.log(`On Query -> ${e.query} ${e.params}`)
// })

export default prisma;
