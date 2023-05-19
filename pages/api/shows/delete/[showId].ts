import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let query: number = parseInt(req.query.showId)
    try {
        await prisma.show.update({
            where: {
                ShowId: query,
            },
            data: {
                Deleted: true
            }
        })
        res.status(200).end();
    } catch (e) {

        throw e
    }

}
