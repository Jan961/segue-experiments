import prisma from 'lib/prisma';

export default async function handle(req, res) {
  const AccountId: number = parseInt(req.query.AccountId);
  const EntryType: number = parseInt(req.query.EntryType);

  const result = await prisma.emailImport.findMany({
    where: {
      AccountID: AccountId,
      Procesesd: false,
      Type: EntryType,
    },
  });
  res.json(result);
}
