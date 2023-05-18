import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const updateBookingVenue = (date, venueID, tourID) => {
  fetch(`/api/tours/booking/update/${tourID}/${venueID}/${date}`)
    .then((res) => res.json())
  return true
}

const bookingInclude = Prisma.validator<Prisma.BookingInclude>()({
  DateType: true,
  Venue: true,
  Tour: {
    include: {
      Show: true
    }
  }
})

export type BookingsByTourIdType = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

export const getBookingsByTourId = async (TourId: number) => {
  return prisma.booking.findMany({
    where: {
      TourId
    },
    include: bookingInclude,
    orderBy: {
      ShowDate: 'asc'
    }
  })
}

export const updateBooking = async (booking: any) => {
  return prisma.booking.update({
    where: {
      BookingId: booking.BookingId
    },
    data: booking,
    include: bookingInclude
  })
}

export const clearBookingById = async (BookingId: any) => {
  const result = await prisma.$transaction([
    prisma.booking.update({
      where: {
        BookingId
      },
      data: {
        VenueId: null,
        Notes: null,
        Miles: null,
        TravelTime: null,
        RunDays: null,
        DateTypeId: 1,
        RehearsalTown: null,
        TravelTimeMins: null,
        LandingPageURL: null,
        VenueContractStatus: null,
        ContractSignedDate: null,
        ContractCheckedBy: null,
        ContractReturnDate: null,
        ContractSignedBy: null,
        ContractNotes: null,
        DealNotes: null,
        GP: null,
        MarketingDealNotes: null,
        MarketingPlanReceived: false,
        CrewNotes: null,
        BarringExemptions: null,
        TicketPriceNotes: null,
        OnSale: false,
        ContractReceivedBackDate: null,
        BankDetailsReceived: null,
        PrintReqsReceived: false,
        ContactInfoReceived: false,
        SalesNotes: null,
        HoldNotes: null,
        CompNotes: null,
        BookingStatus: 'U',
        MerchandiseNotes: null,
        DayTypeCast: 1,
        DayTypeCrew: 1,
        LocationCast: '',
        LocationCrew: ''
      },
      include: bookingInclude
    }),
    prisma.bookingPerformance.deleteMany({
      where: {
        BookingId
      }
    })
  ])

  return result[0]
}

export const updateBookingDay = (date: string, venueid: any) => {
}

export const getPerformances = (BookingId) => {
  console.log('Booking Service Get Performances ' + BookingId)
  fetch(`/api/bookings/Performances/${BookingId}/`)
    .then(data => data)
    .then((data) => {
      console.log(data)
      return data
    })
}
