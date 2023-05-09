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
        try {

        const searchResults = await prisma.tour.findMany({
            where: {
                ShowId: parseInt(req.query.ShowId),
                Deleted: false,
            },
            include:{
                Show: true,
            }

        })
        res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }
}