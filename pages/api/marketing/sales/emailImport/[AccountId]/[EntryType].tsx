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

    let AccountId: number = parseInt(req.query.AccountId)
    let EntryType: number  = parseInt(req.query.EntryType)

    const result = await prisma.emailImport.findMany(
        {

            where:{
                AccountID: AccountId,
                Procesesd: false,
                Type: EntryType


            },

        }
    )
    res.json(result)
}