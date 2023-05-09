import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
import {loggingService} from "../../../../services/loggingService";
import {userService} from "../../../../services/user.service";
const prisma = new PrismaClient()


export default async function handle(req, res) {
/*
    try {
        const  updateBooking = await prisma.booking.create({
            data: {
                VenueId: req.body.VenueId,
                TourId:req.body.TourId,
                ShowDate:req.body.ShowDate,
                PerformancesPerDay:req.body.PerformancesPerDay,
                Performance1Time:req.body.Performance1Time,
                Performance2Time:req.body.Performance2Time,
                Notes:req.body.Notes,
                Miles:req.body.Miles,
                Pencil:req.body.Pencil,
                TravelTime:req.body.TravelTime,
                RunDays:req.body.RunDays,
                DateTypeId:req.body.DateTypeId,
                Last_change:req.body.Last_change,
                RehearsalTown:req.body.RehearsalTown,
                FirstBookingId:req.body.FirstBookingId,
                TravelTimeMins:req.body.TravelTimeMins,
                LandingPageURL:req.body.LandingPageURL,
                VenueContractStatus:req.body.VenueContractStatus,
                ContractSignedDate:req.body.ContractSignedDate,
                ContractSignedBy:req.body.ContractSignedBy,
                ContractReturnDate:req.body.ContractReturnDate,
                ContractCheckedBy:req.body.ContractCheckedBy,
                RoyaltyPC:req.body.RoyaltyPC,
                DealType:req.body.DealType,
                DealNotes:req.body.DealNotes,
                GP:req.body.GP,
                MarketingDealNotes:req.body.MarketingDealNotes,
                CrewNotes:req.body.CrewNotes,
                BarringExemptions:req.body.BarringExemptions,
                ContractNotes:req.body.ContractNotes,
                TicketPriceNotes:req.body.TicketPriceNotes,
                OnSale:req.body.OnSale,
                OnSaleDate:req.body.OnSaleDate,
                ContractReceivedBackDate:req.body.ContractReceivedBackDate,
                BankDetailsReceived:req.body.BankDetailsReceived,
                MarketingPlanReceived:req.body.MarketingPlanReceived,
                PrintReqsReceived:req.body.PrintReqsReceived,
                ContactInfoReceived:req.body.ContactInfoReceived,
                SalesNotes:req.body.SalesNotes,
                HoldNotes:req.body.HoldNotes,
                CompNotes:req.body.CompNotes,
                BookingStatus:req.body.BookingStatus,
                MerchandiseNotes:req.body.MerchandiseNotes,
            },
        })
        res.status(200).json(updateBooking)
    } catch (e){

        loggingService.logError(e)
            .then(
                res.status(400)
            )

    }

 */
}