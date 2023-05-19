import prisma from 'lib/prisma'

/**
 * SELECT * FROM `Booking` WHERE `TourId` = 4 AND `ShowDate` LIKE '%2022-02-07%'
 *
 * @param req
 * @param res
 */
export default async function handle(req, res) {

    try {
        const dayTypes = await prisma.dateType.findMany({

        });

        res.status(200).json(dayTypes)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}
