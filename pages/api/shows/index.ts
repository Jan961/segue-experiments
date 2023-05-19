import prisma from 'lib/prisma'

export default async function handle(req, res) {
    const shows = await prisma.show.findMany(
        {
            where:{
                Deleted: false
            }
        }
    )
    res.json(shows)
}
