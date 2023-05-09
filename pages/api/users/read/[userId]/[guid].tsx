
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


    const userGuid = req.query.guid
    const userId = req.query.userId
    try {
        const searchResults = await prisma.user.findFirst(
            {
                where: {
                    Guid: {
                        equals: userGuid,
                    },
                    AND: {
                        UserId: {
                            equals: parseInt(userId),
                        },
                    },
                },
            })


        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ searchResults }))
    }

    catch (error) {
        res.json(error);
        res.status(405).end();
    }

}