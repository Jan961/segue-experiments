import prisma from 'lib/prisma'

export default async function handle(req, res) {

    // reset booking id to blank booking
    try{
        let bookingID = parseInt(req.body)

        const deleteBooking = await prisma.booking.update({
            where: {
                BookingId: bookingID
            },
            data: {
                VenueId:null,
                Notes: null,
                Miles:null,
                TravelTime:null,
                RunDays:null,
                DateTypeId: 1,
                RehearsalTown:null,
                TravelTimeMins:null,
                LandingPageURL:null,
                VenueContractStatus: null,
                ContractSignedDate:null,
                ContractCheckedBy:null,
                ContractReturnDate: null,
                ContractSignedBy:null,
                ContractNotes: null,
                DealNotes:null,
                GP:null,
                MarketingDealNotes:null,
                MarketingPlanReceived: false,
                CrewNotes:null,
                BarringExemptions: null,
                TicketPriceNotes: null,
                OnSale:false,
                ContractReceivedBackDate: null,
                BankDetailsReceived:null,
                PrintReqsReceived:false,
                ContactInfoReceived: false,
                SalesNotes:null,
                HoldNotes:null,
                CompNotes:null,
                BookingStatus:"U",
                MerchandiseNotes:null,
                DayTypeCast: 1,
                DayTypeCrew: 1,
                LocationCast:"",
                LocationCrew: "",
            },
        })
        const deletePerfomances = await prisma.bookingPerformance.deleteMany({
            where: {
                BookingId: bookingID
            },

        })


        console.log("deleted " + req.data.bookingId)
        res.status(200).json({"done": true})
    } catch (e){
        console.log(e)
    }


}
