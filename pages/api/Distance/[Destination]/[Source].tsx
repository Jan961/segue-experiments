import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handle(req, res) {

    //Mileage from VenueVenue table not all venues are in V1, so we may need to do a V1->v2 search
    // This will be replaced when  doing Distance as this will be generated


        try {

            let Destination = parseInt(req.query.Destination)
            let Source = parseInt(req.query.Source)
            let distance: any
            distance = await prisma.venueVenue.findFirst({
                where: {
                    AND:[{
                        Venue1Id: Destination,
                        Venue2Id: Source
                    }],
                }
            })

            if (distance == null){
                 distance = await prisma.venueVenue.findFirst({
                    where: {
                        AND:[{
                            Venue2Id: Destination,
                            Venue1Id: Source
                        }],
                    }
                })


            }

            res.status(200).json(distance)


        } catch (e) {
            res.status(500)
                console.log(e)
        }

}