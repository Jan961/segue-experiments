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


    try {
        const searchResults = await prisma.userPermissions.findMany({

            where:{
                PermissionId : 3
             },
            }
        )

        //console.log(searchResults)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ searchResults }))
    }

    catch (error) {
        console.log(error)
        res.json(error);
        res.status(405).end();
    }

}