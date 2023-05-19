import prisma from 'lib/prisma'

/**
Parameters = TourId & ", "
Parameters = Parameters & IIf(Nz(VenueId, INVALID_ID) > 0, VenueId, "Null") & ", "
Parameters = Parameters & IIf(IsDate(FromDate), "'" & Format(FromDate, "yyyymmdd") & "', ", "Null, ")
Parameters = Parameters & IIf(IsDate(ToDate), "'" & Format(ToDate, "yyyymmdd") & "'", "Null")
*/
export default async function handle(req, res) {

    //console.log(JSON.stringify(req.body))
    let TourId = req.body.Tour
    let VenueID = req.body.Venue // Can be null
    let fromDate = req.body.DateFrom // Can be null
    let toDate = req.body.DateFrom // Can be null

    let query = `call GetPromoterHolds(${TourId}, ${VenueID},${fromDate},${toDate})`

    try {
        let  result =  await prisma.$queryRawUnsafe(`${query}`)
        //console.log(result)
        return res.status(200).json(result)

    } catch (e){
        //console.log(e)
        res.status(401)

    }

}
