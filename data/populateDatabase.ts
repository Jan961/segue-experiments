import { DateType, PrismaClient } from '@prisma/client'
import dateTypes from './dateTypes.json'
import venues from './venues.json'

const prisma = new PrismaClient()

const populateDateTypes = async () => {
  await prisma.dateType.createMany({ data: dateTypes as DateType[] })
}

const populateVenues = async () => {
  await prisma.venue.createMany({ data: venues })
}

const start = () => {
  populateVenues()
}

start()
