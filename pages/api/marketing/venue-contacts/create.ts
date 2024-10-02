import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { VenueContactDTO } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const vc = req.body as VenueContactDTO;
    const prisma = await getPrismaClient(req);
    const result = await prisma.venueContact.create({
      data: {
        FirstName: vc.FirstName,
        LastName: vc.LastName,
        Email: vc.Email,
        Phone: vc.Phone,
        Venue: {
          connect: {
            Id: vc.VenueId,
          },
        },
        VenueRole: {
          connect: {
            Id: vc.VenueRoleId,
          },
        },
      },
    });

    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating VenueContact' });
  }
}
