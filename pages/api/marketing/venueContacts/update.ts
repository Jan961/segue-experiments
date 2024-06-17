import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { VenueContactDTO } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { venueRoleMapper } from 'lib/mappers';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const vc = req.body as VenueContactDTO;

    // if vc.Id is undefined - create the venue contact.
    // the table is populate with standard roles even if the venue doesn't have those roles stored against that venue
    // this api needs to create the role if a VC being edited doesn;t have an id
    if (vc.Id === undefined) {
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
      res.status(200).json(venueRoleMapper(result));
    } else {
      await prisma.venueContact.update({
        where: {
          Id: vc.Id,
        },
        data: {
          FirstName: vc.FirstName,
          LastName: vc.LastName,
          Email: vc.Email,
          Phone: vc.Phone,
          VenueRole: {
            connect: {
              Id: vc.VenueRoleId,
            },
          },
        },
      });
      res.status(200).json({});
    }
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err });
  }
}
