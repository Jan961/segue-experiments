import { PrismaClient } from '@prisma/client'
import {dateService} from "../../../../../../services/dateService";
import moment from "moment";
const prisma = new PrismaClient()

export default async function handle(req, res) {
//SELECT * FROM `Booking` WHERE Booking.ShowDate BETWEEN date and date AND Booking.TourId = tourID

    let TourId = parseInt(req.query.TourID)
    let DateFrom = new Date(req.query.DateFrom)
    let DateTo = new Date(req.query.DateTo)

    //console.log(TourId + " " + DateTo + " " + DateFrom + " " + JSON.stringify(req.query))
    try {
        let result = await prisma.booking.findMany(
            {
                where: {
                    TourId: TourId,
                    ShowDate: {
                        lte: new Date(DateTo),
                        gte: new Date(DateFrom),
                    },
                    NOT:{
                        VenueId: null
                    }
                },
                include:{
                    Venue: true
                }
            }
        )
        res.json(result)
        res.status(200)
    } catch(error){
        console.log(error)
        res.status(401)
    }

}