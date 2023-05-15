import { Venue } from '../interfaces'
import getConfig from 'next/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const { publicRuntimeConfig } = getConfig()
const baseUrl = `${publicRuntimeConfig.apiUrl}`

export const getTourByCode = async (ShowCode: string, TourCode: string) => {
  return prisma.tour.findFirst(
    {
      where: {
        Code: TourCode as string,
        Show: {
          Code: ShowCode as string
        }
      },
      include: {
        Show: true
      }
    }
  )
}

export const getTourVenueByDate = (TourId, Date) => {
  const venues: Venue = null
  // Call api

  return venues
}

export const getNextTourVenue = (TourID, Date) => {
  // Date + 1 day

  return getTourVenueByDate(TourID, Date)
}

export const getTourById = async (TourId: number) => {
  return await prisma.tour.findUnique({
    where: {
      TourId
    },
    include: {
      Show: true
    }
  })
}

function getLastTourVenue (TourID, Date) {
  // Date - 1 day
  let venue = null

  /**
     * Run a loop to find he last venue as it may not be the day before
     */
  while (venue === null) {
    const result = getTourVenueByDate(TourID, Date)
    venue = result.VenueId
  }
  // Only return the last venue
  return venue
}

function getTourVenuesWithinDistance (VenueID, distance = null) {
  const venues = [] // Empty array
  // Call api

  return venues
}

function getTourGaps (tourId) {
  let gaps = []
  fetch(`${baseUrl}/tours/read/gaps/${tourId}`)
    .then((res) => res.json())
    .then((data) => {
      gaps = data
    })

  return gaps
}

function getTourVenueStatus (tourID) {
  const tourId = parseInt(tourID)
  let result
  fetch(`http://127.0.0.1:3000/api/marketing/venue/status/${tourId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)

      result = data
    })
  return result
}
