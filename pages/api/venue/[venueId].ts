import prisma from 'lib/prisma'

export default async function handle(req, res) {


    let query: number = parseInt(req.query.venueId)
    try {
       let venue  = await prisma.venue.findFirst(
            {
                where:{
                    VenueId:   query
                },
            }
        )
            res.status(200).json(venue).end();
        }

    catch (error) {
        res.json(error);
        res.status(405).end();
    }

}
