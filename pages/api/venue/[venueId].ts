
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *
 * TODO: Account ID (Where source = 0 OR Source  = {account_id}
 *
 * @param req
 * @param res
 */
export default async function handle(req, res) {


    let query: number = parseInt(req.query.venueId)
    try {
   await prisma.venue.findMany(
        {
            where:{
                VenueId:   query
            },
        }
    )
        res.status(200).end();
    }

    catch (error) {
        res.json(error);
        res.status(405).end();
    }

}