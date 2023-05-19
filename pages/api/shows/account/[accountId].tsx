import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {

        let account = req.body.accountId

        const searchResults = await prisma.show.findMany({

            where: {
                AccountId:account,
                Archived: false,
                Deleted: false
            },
            select:{
              ShowId: true,
              Name: true
            },
    })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ searchResults }))

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}


