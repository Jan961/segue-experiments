import prisma from 'lib/prisma'

export default async function handle(req, res) {


    const acc = req.query.accountId
    try {
        const searchResults = await prisma.user.findMany(
            {
                where:{
                    AccountId: parseInt(acc)
                },
            }
        )

        //console.log(searchResults)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.json(searchResults)
    }

    catch (error) {
        console.log(error)
        res.json(error);
        res.status(405).end();
    }

}
