import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { checkAccess, getEmailFromReq } from 'services/userService'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).end() // Method Not Allowed
  }
  try {
    const { bookingId, ...updatedData } = req.body
    if (!bookingId) {
      return res.status(400).json({ error: 'missing required params' })
    }
    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { BookingId: bookingId })
    if (!access) return res.status(401).end()
    // Update the Venue entry in the database
    const updatedVenue = await prisma.venue.update({
      where: {
        ...(bookingId && { Id: bookingId })
      },
      data: updatedData
    })
    return res.status(200).json(updatedVenue)
  } catch (error) {
    console.error('Error updating Venue:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  } finally {
    await prisma.$disconnect()
  }
}
