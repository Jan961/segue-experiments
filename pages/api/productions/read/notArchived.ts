/* eslint-disable camelcase */
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountIdFromReq } from 'services/userService';

let prisma = null;

const generateSearchResults = async (options) => {
  return await prisma.production.findMany({
    where: {
      ...options.where,
      Archived: false,
    },
    include: {
      Show: true,
      ProductionTask: {
        where: {
          ...options.productionTaskWhere,
        },
        include: {
          User_ProductionTask_AssignedByToUser: true,
          User_ProductionTask_AssigneeToUser: true,
        },
        orderBy: {
          DueDate: 'desc',
        },
      },
    },
  });
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      prisma = await getPrismaClient(req);
      // To be changed back to headers once ssl cert is placed
      const { segue_admin, account_admin, user_id } = await req.body;

      const AccountId = getAccountIdFromReq(req);

      const options: any = {};

      if (segue_admin) {
        // No additional options needed
      } else if (account_admin) {
        options.where = { ProductionOwner: AccountId };
      } else if (user_id) {
        options.where = { ProductionOwner: AccountId };
        options.productionTaskWhere = { Assignee: parseInt(user_id) };
      } else {
        options.where = { ProductionOwner: AccountId };
        options.productionTaskWhere = { Assignee: parseInt(user_id) };
      }

      const searchResults = await generateSearchResults(options);
      res.json(searchResults);
    } else if (req.method === 'GET') {
      const result = await prisma.production.findMany({
        where: {
          Archived: false,
        },
        include: {
          Show: true,
        },
      });

      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: 'Error occurred while generating search results. ' + err });
  }
}
