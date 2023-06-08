import { Booking, Prisma } from '@prisma/client'
import prisma from 'lib/prisma'
import { omit } from 'radash'

export const updateBookingVenue = (date, venueID, tourID) => {
  fetch(`/api/tours/booking/update/${tourID}/${venueID}/${date}`)
    .then((res) => res.json())
  return true
}

const bookingInclude = Prisma.validator<Prisma.BookingInclude>()({
  Venue: true,
  Performance: true
})

export type BookingsWithPerformances = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

export const updateBooking = async (booking: Booking) => {
  return prisma.booking.update({
    where: {
      Id: booking.Id
    },
    data: omit(booking, ['Id']),
    include: bookingInclude
  })
}

export const deleteBookingById = async (BookingId: any) => {
  await prisma.$transaction([
    prisma.booking.delete({
      where: {
        Id: BookingId
      }
    }),
    prisma.performance.deleteMany({
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
    }
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
