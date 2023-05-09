
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

    let query: number = parseInt(req.query.venueId)
    try {
        await prisma.venue.update({
            where: {
                VenueId: query,
            },
            data: {
                deleted: parseInt("1"),
            }
        })
        res.status(200).end();
    } catch (e) {

        throw e
    }

}