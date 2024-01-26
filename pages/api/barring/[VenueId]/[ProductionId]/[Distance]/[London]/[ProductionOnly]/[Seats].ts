import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

function getBool(toBeParserd: string) {
  if (parseInt(toBeParserd) === 1) {
    return true;
  } else {
    return false;
  }
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const ProductionId = parseInt(req.query.ProductionId as string);
  const VenueId = parseInt(req.query.VenueId as string);
  const London = getBool(req.query.London as string);
  const Seats = parseInt(req.query.Seats as string);
  const ProductionOnly = getBool(req.query.ProductionOnly as string);

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ProductionId });
  if (!access) return res.status(401).end();

  const query = `CALL GetBarringVenues(${VenueId},${ProductionId},${London},${Seats},${ProductionOnly});`;

  try {
    const result: any[] = await prisma.$queryRawUnsafe(`${query}`);

    let uniqueArray: any[] = [];
    uniqueArray = result.reduce((acc, current) => {
      const stringified = JSON.stringify(current);
      if (!acc.some(item => JSON.stringify(item) === stringified)) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    res.json(uniqueArray);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
}
