import prisma from 'lib/prisma'

export default async function handle(req, res) {
    
    const accountId = parseInt(req.query.accountId)
    const result = await prisma.venue.findMany(
        {
            where: {
                deleted: 0,
                AccountId:accountId
            }
        }
    )
    res.json(result)
}
