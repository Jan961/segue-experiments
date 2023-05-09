/**
 *
 * Get a list of users for this account
 *
 */



import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *
 * @param req
 * @param res
 */
export default async function handle(req, res) {

    console.log(req.query.accountId)
    const acc = parseInt(req.query.accountId)
    try {
        const searchResults = await prisma.user.findMany(
            {
                where:{
                    AccountId: acc
                },
            }
        )
        //console.log(searchResults)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ searchResults }))
    }

    catch (error) {
        console.log(error)
        res.json(error);
        res.status(405).end();
    }

}