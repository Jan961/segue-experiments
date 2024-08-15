import prisma from 'lib/prisma';

export const fetchAllStandardClauses = async () => {
  const clauses = await prisma.ACCStandardClause.findMany({});
  return clauses.map(({ Id, Text, StdClauseTitle }) => ({
    id: Id,
    text: Text,
    title: StdClauseTitle,
  }));
};

export const fetchAllContracts = async (productionId?: number) => {
  const contracts = await prisma.ACCContracts.findMany({
    where: {
      ...(productionId && {
        ProductionId: productionId,
      }),
    },
  });
  return contracts.map();
};
