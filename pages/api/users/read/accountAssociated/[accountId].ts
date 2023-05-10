
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


    const acc = req.query.accountId
    try {
        const searchResults = await prisma.user.findMany(
            {
                where:{
                    AccountId: parseInt(acc)
                },
            }
        )

        //console.log(searchResults)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.json(searchResults)
    }

    catch (error) {
        console.log(error)
        res.json(error);
        res.status(405).end();
    }

}