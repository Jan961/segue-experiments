import { Prisma } from '@prisma/client'
import prisma from 'lib/prisma'

export const updateBookingVenue = (date, venueID, tourID) => {
  fetch(`/api/tours/booking/update/${tourID}/${venueID}/${date}`)
    .then((res) => res.json())
  return true
}

const bookingInclude = Prisma.validator<Prisma.BookingInclude>()({
  Venue: true,
  Performance: true
})

export type BookingsByTourIdType = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

export const updateBooking = async (booking: any) => {
  return prisma.booking.update({
    where: {
      BookingId: booking.BookingId
    },
    data: booking,
    include: bookingInclude
  })
}

export const deleteBookingById = async (BookingId: any) => {
  await prisma.$transaction([
    prisma.booking.delete({
      where: {
        BookingId
      }
    }),
    prisma.bookingPerformance.deleteMany({
      where: {
        BookingId
      }
    })
  ])
}

export const changeBookingDate = async (Id: number, FirstDate: Date) => {
  return prisma.booking.update({
    where: {
      Id
    },
    data: {
      FirstDate
    },
    include: bookingInclude
  })
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
