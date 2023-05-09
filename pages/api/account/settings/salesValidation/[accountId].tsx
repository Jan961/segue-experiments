
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default  async function handle(req, res) {

    const validation = await prisma.accountSalesDataValidaton.findUnique({
        where: {
            AccountId: parseInt(req.query.accountId),
        },

    })

    res.status(200).json(validation)
}