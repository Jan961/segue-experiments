import prisma from 'lib/prisma'

export default async function handle(req, res) {

   // console.log(req.query.accountId)
    const acc = parseInt(req.query.accountId)
    try {
        const searchResults = await prisma.user.findMany(
            {
                where:{
                    AccountId: acc
                },
            }
        )
        //console.log(searchResults)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ searchResults }))
    }

    catch (error) {
        console.log(error)
        res.json(error);
        res.status(405).end();
    }

}
