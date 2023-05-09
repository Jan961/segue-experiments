
import { PrismaClient } from '@prisma/client'
import {number} from "prop-types";
const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *
 *
 * @param req ShowID
 * @param res
 */
export default async function handle(req, res) {

    let query: number = parseInt(req.query.tourId)
    try {
        await prisma.tour.update({
            where: {
                TourId: query,
            },
            data: {
                Deleted: true,
            }
        })
        res.status(200).end();
    } catch (e) {

        throw e
    }

}