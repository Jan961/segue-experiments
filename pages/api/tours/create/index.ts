import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {Tour} from "../../../../interfaces";
import { parseISO, format } from 'date-fns';

const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        const TourResult = await prisma.tour.create({
            data: {
                Code  : req.body.Code,
                ShowId: req.body.ShowId,
                TourStartDate : parseISO(req.body.TourStartDate),
                TourEndDate : parseISO(req.body.TourEndDate),
                Archived    :false,
                Deleted: false,
                RehearsalStartDate: parseISO(req.body.RehearsalStartDate),
                RehearsalEndDate : parseISO(req.body.RehearsalEndDate),
                TourOwner : req.body.Owner,
                Logo : req.body.logo,
                CreatedBy: null
            },
        })

        // Create All the Bookings
        //Rehearsal
        console.log("Tour ID:" + TourResult.TourId + "\r\n " + parseISO(req.body.TourStartDate) + "<-Date")

        for (var rehearsalDate = new Date(parseISO(req.body.RehearsalStartDate)); rehearsalDate <= new Date(parseISO(req.body.RehearsalEndDate)); rehearsalDate.setDate(rehearsalDate.getDate() + 1)) {
            // Create Empty RehearsalDay

            const [result] = await Promise.all([prisma.booking.create({
// @ts-ignore
                 data: {
                    TourId: parseInt(TourResult.TourId.toString()),
                    ShowDate: rehearsalDate,
                    Notes: "Generated",
                    DateTypeId:18,
                    OnSale :false,
                    MarketingPlanReceived:false,
                    PrintReqsReceived :false,
                    ContactInfoReceived :false,
                    BookingStatus:"C",
                },
            })])
        }
        for (var bookingDate = new Date(parseISO(req.body.TourStartDate)); bookingDate <= new Date(parseISO(req.body.TourEndDate)); bookingDate.setDate(bookingDate.getDate() + 1)) {
            const [result] = await Promise.all([prisma.booking.create({
                // @ts-ignore
                data: {
                    TourId: TourResult.TourId,
                    ShowDate: bookingDate,
                    Notes: "Generated",
                    DateTypeId:1,
                    OnSale :false,
                    MarketingPlanReceived:false,
                    PrintReqsReceived :false,
                    ContactInfoReceived :false,
                    BookingStatus:"U",

                },
            })])
        }




        res.statusCode = 200
        res.status(200).json(TourResult)
        res.setHeader('Content-Type', 'application/json')

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}


