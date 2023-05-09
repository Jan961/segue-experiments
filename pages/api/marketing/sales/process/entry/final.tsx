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

   try{
       let result = await prisma.bookingSale.create({
           data: {
               BookingId: parseInt(req.body.BookingId), //hold link to Venue/Date
               SalesFiguresDate: new Date(),
               NumSeatsSold:  parseInt(req.body.SeatsSold),
               SoldSeatsValue: parseFloat(req.body.SeatsSoldValue),
               NumSchoolSeatsSold: parseInt(req.body.SchoolsSeatsSold),
               SoldSchoolSeatsValue: parseFloat(req.body.SchoolsSeatsSoldValue),
               FinalFigures: true,
               IsCopy: false,
           },
       })

       res.json(result)
       res.status(200)
       // Return the inserted ID it is needed for related foreach inserts

   } catch(e) {
        console.log(e)
       res.status(401)
   }
}