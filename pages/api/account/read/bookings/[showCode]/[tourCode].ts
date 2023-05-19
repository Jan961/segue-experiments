import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let result: any =""

    const tourCode  = req.query.tourCode
    const showCode = req.query.showCode

    try {
        result =  await prisma.$queryRaw`Select * from Booking LEFT JOIN Tour ON Booking.TourID = Tour.TourId Left Join \`Show\` ON Tour.ShowId = \`Show\`.ShowID WHERE Tour.Code = ${tourCode} AND \`Show\`.Code = ${showCode}`
    } catch (e) {

        throw e
    }
    res.json(result)
}


/**
 *
 * RAW SQL for data
 *
 * Select * from Booking
 * LEFT JOIN Tour
 * ON Booking.TourID = Tour.TourId
 * Left Join Show
 * ON Tour.ShowId = Show.ShowID
 *
 */
