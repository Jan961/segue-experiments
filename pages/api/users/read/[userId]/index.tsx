import prisma from 'lib/prisma'

export default async function handle(req, res) {


    const acc = req.query.userId
    try {
        const searchResults = await prisma.user.findFirst(
            {
                where:{
                    UserId: parseInt(acc)
                },
            }
        )

        //console.log(searchResults)
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
