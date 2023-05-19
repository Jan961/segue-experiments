import prisma from 'lib/prisma'

export default async function handle(req, res) {


    const acc = req.query.accountId//parseInt(req.data.accountID)
    try {
        const searchResults = await prisma.account.findFirst(
            {
                where:{
                    AccountId: parseInt(acc)
                },
            }
        )

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ searchResults }))
    }

    catch (error) {
        console.log(error)
        res.json(error);
        res.status(405).end();
    }

}
