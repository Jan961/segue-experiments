import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {Show} from "../../../../interfaces";

const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {

        const searchResults = await prisma.show.findFirst({
            where: {
                ShowId: parseInt(req.query.ShowId),
                Archived: false

            }
        })

        res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}


