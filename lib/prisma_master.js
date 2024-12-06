import { PrismaClient } from 'prisma/generated/prisma-master';

if (!global.prisma) {
  const prismaMaster = new PrismaClient({
    datasourceUrl: `${process.env.MASTER_DATABASE_URL}?connection_limit=1&pool_timeout=0`,
    transactionOptions: {
      isolationLevel: 'Serializable',
      maxWait: 4000, // default: 2000
      timeout: 5000, // default: 5000
    },
    log: ['info'],
  });
  global.prisma = prismaMaster;
}

export default global.prisma;
