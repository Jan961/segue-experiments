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
               BookingId: parseInt(req.body.Venue),
               SalesFiguresDate: new Date(),
               NumSeatsSold:  parseInt(req.body.SeatsSold),
               NumSeatsReserved: parseInt(req.body.ReservedSeats),
               SoldSeatsValue: req.body.SeatsSoldValue,
               ReservedSeatsValue:  req.body.SeatReservedValue,
               NumSchoolSeatsSold: req.body.SchoolsSeatsSold,
               NumSchoolSeatsReserved:  null,
               SoldSchoolSeatsValue: parseInt(req.body.SchoolsSeatsSoldValue),
               ReservedSchoolSeatsValue:  null,
               BrochureReleased: false,
               SingleSeats:false,
               NotOnSale: false,
               FinalFigures: false,
               IsCopy: false,
           },
       })
       //console.log(result)



       let notes = await prisma.bookingSaleNotes.create({
           data: {
               BookingSaleId: result.BookingSaleId,
               HoldNotes: req.body.HoldNotes,
               CompNotes: req.body.CompNotes,
               BookingSaleNotes: req.body.BookingSaleNotes
           },
       })

       //Venue
       let VenueComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 1,
               Seats: parseInt(req.body.VenueSeats)
           },
       })
       let PromoterComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 2,
               Seats: parseInt(req.body.PromoterSeats)
           },
       })
       let CompanionComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 3,
               Seats: parseInt(req.body.CompanionSpaceSeats)
           },
       })
       let StaffComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 4,
               Seats: parseInt(req.body.StaffSeats)
           },
       })
       let CastCrewComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 5,
               Seats: parseInt(req.body.CastCrewSeats)
           },
       })
       let OtherComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 6,
               Seats: parseInt(req.body.OtherSeats)
           },
       })
       let HouseManagementComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 7,
               Seats: parseInt(req.body.HouseManagementSeats)
           },
       })
       let PressComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 8,
               Seats: parseInt(req.body.PressSeats)
           },
       })
       let MixerComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 9,
               Seats: parseInt(req.body.MixerSeats)
           },
       })
       let TechnicalComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 10,
               Seats: parseInt(req.body.TechnicalSeats)
           },
       })
       let OffSaleComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 11,
               Seats: parseInt(req.body.OffSaleSeats)
           },
       })
       let WheelchairComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 12,
               Seats: parseInt(req.body.WheelchairSeats)
           },
       })
       let RestrictedViewComp = await prisma.bookingSaleComp.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               CompId: 13,
               Seats: parseInt(req.body.RestrictedViewSeats)
           },
       })
       let PromoterHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 1,
               Seats: parseInt(req.body.PromoterHoldsSeats),
               Value: parseFloat(req.body.PromoterHoldsValue)
           },
       })
       let PressHold = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 2,
               Seats: parseInt(req.body.PressHoldsSeats),
               Value: parseFloat(req.body.PressHoldsValue)
           },
       })
       let MixerHold = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 3,
               Seats: parseInt(req.body.MixerHoldsSeats),
               Value: parseFloat(req.body.MixerHoldsValue)
           },
       })
       let OffSaleHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 4,
               Seats: parseInt(req.body.OffSaleHoldsSeats),
               Value: parseFloat(req.body.OffSaleHoldsValue)
           },
       })
       let WheelchairSpaceHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 5,
               Seats: parseInt(req.body.WheelchairSpaceHoldsSeats),
               Value: parseFloat(req.body.WheelchairSpaceHoldsValue)
           },
       })
       let CompanionSpaceHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 6,
               Seats: parseInt(req.body.CompanionSpaceHoldsSeats),
               Value: parseFloat(req.body.CompanionSpaceHoldsValue)
           },
       })
       let RestrictedViewSeatsHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 7,
               Seats: parseInt(req.body.RestrictedViewSeatsHoldsSeats),
               Value: parseFloat(req.body.RestrictedViewSeatsHoldsValue)
           },
       })
       let StaffHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 8,
               Seats: parseInt(req.body.StaffHoldsSeats),
               Value: parseFloat(req.body.StaffHoldsValue)
           },
       })
       let OtherHoldsSeats = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 9,
               Seats: parseInt(req.body.OtherHoldsSeats),
               Value: parseFloat(req.body.OtherHoldsValue)
           },
       })
       let VenueHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 10,
               Seats: parseInt(req.body.VenueHoldsSeats),
               Value: parseFloat(req.body.VenueHoldsValue)
           },
       })
       let TechnicalHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 11,
               Seats: parseInt(req.body.TechnicalHoldsSeats),
               Value: parseFloat(req.body.TechnicalHoldsValue)
           },
       })
       let HouseManagementHolds = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 12,
               Seats: parseInt(req.body.HouseManagementHoldsSeats),
               Value: parseFloat(req.body.HouseManagementHoldsValue)
           },
       })
       let CastCrewHoldsSeats = await prisma.bookingSaleHold.create({
           data:{
               BookingSaleId: result.BookingSaleId,
               HoldId: 13,
               Seats: parseInt(req.body.CastCrewHoldsSeats),
               Value: parseFloat(req.body.CastCrewHoldsValue)
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