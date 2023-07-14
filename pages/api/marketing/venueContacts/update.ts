import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { VenueContactDTO } from 'interfaces'
import { venueRoleMapper } from 'lib/mappers'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const vc = req.body as VenueContactDTO

    const result = await prisma.venueContact.update({
      where: {
        Id: vc.Id
      },
      data: {
        FirstName: vc.FirstName,
        LastName: vc.LastName,
        Email: vc.Email,
        Phone: vc.Phone,
        VenueRole: {
          connect: {
            Id: vc.RoleId
          }
        }
      }
    })
    res.status(200).json(venueRoleMapper(result))
  } catch (err) {
    await loggingService.logError(err)
    console.log(err)
    res.status(500).json({ err: 'Error updating VenueContact' })
  }
}
