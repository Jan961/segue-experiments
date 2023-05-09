
import { PrismaClient } from '@prisma/client'
import {number} from "prop-types";
const prisma = new PrismaClient()
import { parseISO, format } from 'date-fns';

export default async function handle(req, res) {

    let query: number = parseInt(req.query.tourId)
    try {
        await prisma.tour.update({
            where: {
                TourId: query,
            },
            data: {
                Code  : req.body.Code,
                ShowId    : parseInt(req.body.ShowId),
                TourStartDate : parseISO(req.body.TourStartDate),
                TourEndDate : parseISO(req.body.TourEndDate),
                Archived    : false,
                Deleted: false,
                RehearsalStartDate: parseISO(req.body.RehearsalStartDate),
                RehearsalEndDate : parseISO(req.body.RehearsalEndDate),
                TourOwner : parseInt(req.body.Owner),
                Logo: req.body.logo,
                CreatedBy:0
            }
        })
        res.status(200).end();
    } catch (e) {
        res.status(501).end();
    }
    return res
}