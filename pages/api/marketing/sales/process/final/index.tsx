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

    let bookingId = parseInt(req.data.bookingId)
/*
    const result = await prisma.bookingSale.upsert({
        where: { bookingId: bookingId,
                SalesFiguereDate,
                },
        update: { email: 'alice@prisma.io' },
        create: { email: 'alice@prisma.io' },
    })
    res.json(result)

 */
}