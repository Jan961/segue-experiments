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

    try {

        let UserID = req.body.userid

        const searchResults = await prisma.userPermissions.findMany({

            where: {
                UserID:UserID,

            },

        })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ searchResults }))

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }


}