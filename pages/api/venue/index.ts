import prisma from 'lib/prisma'

export default async function handle(req, res) {

    const result = await prisma.venue.findMany(
        {
            where: {
                deleted: 0
            }
        }
    )
    res.json(result)
}
