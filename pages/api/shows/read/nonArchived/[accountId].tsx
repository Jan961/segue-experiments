import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {

        let accountId = req.query.accountId
        const searchResults = await prisma.show.findMany({
            where: {
                AccountId: parseInt(accountId),
                Archived: false
            }
        })

        res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}

