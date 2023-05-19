import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let archived = req.query.archived

    try {
        const searchResults = await prisma.$queryRaw`SELECT * FROM TourView WHERE Archived = ${archived} AND TourEndDate <= ${req.query.date}  ORDER BY TourStartDate`

        res.json(searchResults)



    } catch(err) {
        console.log('Generation error; this is the error: ' + err);
    }



}
