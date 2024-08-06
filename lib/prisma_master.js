import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
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
  prisma = global.prisma;
}

// prisma.$on("query", async (e) => {
//   console.log(`On Query -> ${e.query} ${e.params}`)
// })

export default prisma;
