import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let TourId = req.query.TourId
    let FromWeek = new Date(req.query.FromWeek) // Selected week
    let ToWeek = new Date(req.query.ToWeek) // Selected week -  number of weeks
    let FromTourDate = null
    if (req.query.FromTourDate !== "Null" || req.query.FromTourDate !== "null") {
        FromTourDate = new Date(req.query.FromTourDate)
    }
    let ToTourDate = null
    if (req.query.ToTourDate !== "Null" || req.query.ToTourDate !== "Null") {
        ToTourDate = new Date(req.query.ToTourDate)
    }


    if(req.query.options == "data"){
        try {
            const result = await prisma.$queryRaw`SELECT * FROM \`SalesSummaryView\` WHERE \`TourId\` = ${TourId} AND \`ShowDate\` >= ${FromTourDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromTourDate})
                Or (ShowDate >= ${FromTourDate})) AND (IsNull(${ToTourDate}) Or (ShowDate <= ${ToTourDate}))
                ;`
            res.json(result)

        } catch (e) {

            throw e
            res.statusCode(400)
        }

    } else  if(req.query.options == "CurrencyWeekTotals"){
        try {
            let  result =  await prisma.$queryRaw`
                    SELECT VenueCurrency, VenueCurrency, ConversionRate, TourWeekNum, WeekDate, SUM(Value) AS Total, SUM(RunSeatsSold) AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats
                    FROM SalesSummaryView
                    WHERE \`TourId\` = ${TourId} AND \`ShowDate\` >= ${FromTourDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromTourDate})
                        Or (ShowDate >= ${FromTourDate})) AND (IsNull(${ToTourDate}) Or (ShowDate <= ${ToTourDate}))
                    GROUP BY TourWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate
                    ORDER BY TourWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate
                               `
            res.json(result)
        } catch (e) {

            throw e
            res.statusCode(400)
        }


    } else  if(req.query.options == "weeks"){
        try {
            let  result =  await prisma.$queryRaw`SELECT DISTINCT WeekName, WeekDate, WeekCode FROM \`SalesSummaryView\` WHERE \`TourId\` = ${TourId} AND \`ShowDate\` >= ${FromTourDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromTourDate})
                Or (ShowDate >= ${FromTourDate})) AND (IsNull(${ToTourDate}) Or (ShowDate <= ${ToTourDate})) ORDER BY  WeekDate`
            res.json(result)
        } catch (e) {

            throw e
            res.statusCode(400)
        }


    } else  if(req.query.options == "GrandTotals"){


    } else {
       // res.statusCode(403)
    }

}



