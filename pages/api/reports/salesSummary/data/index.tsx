import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {


    let query =  "SELECT * FROM SalesSummaryView ORDER BY ShowDate, WeekDate"

    try {
        let result = await prisma.$queryRawUnsafe(`${query}`)
        res.json(result)
    } catch (e){
        res.status(401)
    }
}