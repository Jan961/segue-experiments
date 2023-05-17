import { Booking, Prisma, PrismaClient } from '@prisma/client'
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
