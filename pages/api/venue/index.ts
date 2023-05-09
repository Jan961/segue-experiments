import {executeQuery} from '../../../lib/db'
import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {useRouter} from "next/router";

import Shows from "../../shows";
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

    const result = await prisma.venue.findMany(
        {
            where: {
                deleted: 0
            }
        }
    )
    res.json(result)
}