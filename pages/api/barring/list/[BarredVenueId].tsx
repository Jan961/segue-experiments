import prisma from 'lib/prisma'

export default async function handle(req, res) {

    // "SELECT * FROM `VenueBarredVenue` WHERE VenueId = 331 AND BarredVenueId = 345;"

    // If no Result then not barred
    const venueID = req.query.VenueId
    const barredVenueId  = req.query.BarredVenueId

    let query = `SELECT * FROM \`VenueBarredVenue\` WHERE VenueId = ${venueID} AND BarredVenueId = ${barredVenueId};`

    try {
        let  result =  await prisma.$queryRawUnsafe(`${query}`)
        res.status(200).json(result)

    } catch (e) {
        console.log(e)
        res.status(400)
    }


}
