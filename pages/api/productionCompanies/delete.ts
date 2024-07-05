import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const deletedRecord = await prisma.ProductionCompany.delete({
      where: {
        Id: id,
      },
    });

    res.status(200).json(deletedRecord);
  } catch (exception) {
    res.status(500).json({
      errorMessage: 'An error occurred whilst deleting your Production Company. Please try again.',
    });
  }
}
