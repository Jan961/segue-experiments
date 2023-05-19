import prisma from 'lib/prisma'

export default async function handle(req, res) {
    /**
    let query =  "Select * FROM ActivityDetailView " +
        " Where FollowUpRequired = true" +
        " AND DueByDate === null OR DueByDat <= NOW() "
    if(req.query.TourId !== null){
        query = query + ` AND TourId = ${req.query.TourId}`
    }
    query = query +  " ORDER BY TourCode, ShowDate"
*/
    let TourId = parseInt(req.query.TourId)

    let query  = "Select * FROM TourTask " +
        " LEFT JOIN `Show` ON TourTask.TourId = `Show`.ShowId" +
        " LEFT JOIN Tour ON TourTask.TourId = Tour.TourId " +
        "Where Progress != 100 "
    if(TourId !== null) {
        query  =  query + ` AND Tour.TourId =  ${TourId}`
    }
    query  =  query +   " ORDER BY Tour.TourId;"
    //console.log(query)

    try {
        let result = await prisma.$queryRawUnsafe(`${query}`)
        res.json(result)
    } catch (e){
        res.status(200)
    }

}
