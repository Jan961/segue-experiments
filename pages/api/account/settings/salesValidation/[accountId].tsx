import prisma from 'lib/prisma'

export default  async function handle(req, res) {

    const validation = await prisma.accountSalesDataValidaton.findUnique({
        where: {
            AccountId: parseInt(req.query.accountId),
        },

    })

    res.status(200).json(validation)
}
