
import { PrismaClient } from '@prisma/client'
import {number} from "prop-types";
const prisma = new PrismaClient()


export default async function handle(req, res) {


    let query: number = parseInt(req.query.ShowId)
    try {
        await prisma.show.update({
            where: {
                ShowId: req.body.ShowId,
            },
            data: {
                Code: req.body.Code,
                Name: req.body.Name,
                ShowType: req.body.ShowType,
                Logo: req.body.Logo
            }
        })
        res.status(200).end();
    } catch (e) {

        res.status(501).end();
    }
    return res
}