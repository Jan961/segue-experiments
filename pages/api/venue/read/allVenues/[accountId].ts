import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *
 *
 * @param req ShowID
 * @param res
 */
export default async function handle(req, res) {

    const accountId = parseInt(req.query.accountId)
   // console.log(accountId)
    try {
        const result = await prisma.$queryRaw`SELECT * FROM Venue WHERE deleted = 0 AND AccountId = ${accountId};`
        res.json(result)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}