import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {
        let logo = null
        if(req.body.Logo !== ""){
            logo = req.body.Logo
        }
        // @ts-ignore
        const result = await prisma.show.create({
            data: {
                Code: req.body.Code,
                Name: req.body.Name,
                Logo: logo,
                ShowType: req.body.ShowType,
                Published: true,
                Archived: false,
                Deleted: false,
                AccountId: req.body.AccountId,
                Owner: req.body.AccountId
            },
        })

        res.status(200).end();

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}


