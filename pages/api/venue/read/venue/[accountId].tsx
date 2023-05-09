

import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {useRouter} from "next/router";

const prisma = new PrismaClient()

export default async function handle(req, res) {
    
    const accountId = parseInt(req.query.accountId)
    const result = await prisma.venue.findMany(
        {
            where: {
                deleted: 0,
                AccountId:accountId
            }
        }
    )
    res.json(result)
}