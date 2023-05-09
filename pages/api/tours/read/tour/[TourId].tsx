
import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {useRouter} from "next/router";
import Shows from "../../../shows";
import {scalarOptions} from "yaml";
import Int = scalarOptions.Int;
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


    let query = parseInt(req.query.TourId)
    //console.log(query)
    const result = await prisma.tour.findFirst(
        {
            where:{
                TourId:   query,
                Deleted: false
            },
            include: {
                Show: true,
            },
            orderBy: {
                TourStartDate: "desc"
            }
        }
    )
    res.json(result)
}