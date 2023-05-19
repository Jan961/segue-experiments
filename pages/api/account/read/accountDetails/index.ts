import prisma from 'lib/prisma'

export default async function handle(req, res) {


    try {
        await prisma.account.findFirst(
            {
                where:{
                    BusinessName:   req.data.businessName,
                    Postcode: req.data.postcode
                },
            }
        )
        res.status(200).end();
    }

    catch (error) {
        res.json(error);
        res.status(405).end();
    }

}
