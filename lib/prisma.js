import { PrismaClient } from 'prisma/generated/prisma-client';
import { getEmailFromReq } from 'services/userService';
import redis from './redis';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasourceUrl: process.env.DIRECT_DATABASE_URL,
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

export const getPrismaClient = async (req) => {
  const clientDBUrl = process.env.CLIENT_DATABASE_URL;
  const email = await getEmailFromReq(req);
  const orgId = await redis.get(email);
  const prismaUrl = `${clientDBUrl}_dev2_Segue_${orgId}`;
  console.log('getPrismaClient', prismaUrl, orgId);
  const client = (prisma = new PrismaClient({ datasourceUrl: prismaUrl }));

  return client;
};

export default prisma;
