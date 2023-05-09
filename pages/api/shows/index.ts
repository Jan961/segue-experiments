import {executeQuery} from '../../../lib/db'
import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {
    const shows = await prisma.show.findMany(
        {
            where:{
                Deleted: false
            }
        }
    )
    res.json(shows)
}