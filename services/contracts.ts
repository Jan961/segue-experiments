import prisma from 'lib/prisma';

export const fetchAllStandardClauses = async () => {
  const clauses = await prisma.ACCStandardClause.findMany({});
  return clauses.map(({ Id, Text }) => ({
    id: Id,
    text: Text,
  }));
};
