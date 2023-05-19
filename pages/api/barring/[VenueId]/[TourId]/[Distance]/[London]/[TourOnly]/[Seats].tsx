import prisma from 'lib/prisma'

function getBool(toBeParserd){

    if (parseInt(toBeParserd) === 1){
        return true
    } else {
        return  false
    }
}

export default async function handle(req, res) {

    const TourId = parseInt(req.query.TourId)
    const VenueId = parseInt(req.query.VenueId)
    const Distance = parseInt(req.query.Distance)
    const London = getBool(req.query.London)
    const Seats = parseInt(req.query.Seats)
    const TourOnly = getBool(req.query.TourOnly)

    let query = `CALL GetBarringVenues(${VenueId},${TourId},${London},${Seats},${TourOnly});`

    try {
        let  result:any[] =  await prisma.$queryRawUnsafe(`${query}`)

        /**
         * Reduce the returned to unique venues
         */
        let uniqueArray: any[];
        // @ts-ignore
        uniqueArray = [...new Set(result.map(JSON.stringify))].map(JSON.parse);
        res.json(uniqueArray)
    } catch (e) {

        throw e
        res.statusCode(400)
    }


}
