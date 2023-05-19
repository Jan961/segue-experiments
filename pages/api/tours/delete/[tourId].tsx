import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let query: number = parseInt(req.query.tourId)
    try {
        await prisma.tour.update({
            where: {
                TourId: query,
            },
            data: {
                Deleted: true,
            }
        })
        res.status(200).end();
    } catch (e) {

        throw e
    }

}
