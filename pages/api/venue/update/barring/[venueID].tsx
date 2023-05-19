import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let query: number = parseInt(req.query.venueID)
    try {
       // console.log(JSON.stringify(req.body))
        await prisma.venue.update({
            where: {
                VenueId: query,
            },
            data: {
                BarringClause: req.body.BarringClause,
                BarringWeeksPre: parseInt(req.body.BarringWeeksPre),
                BarringWeeksPost: parseInt(req.body.BarringWeeksPost),
                BarringMiles: parseInt(req.body.BarringMiles),

            }
        })
        res.status(200).end();
    } catch (e) {

        res.status(501).end();
    }
 return res
}
