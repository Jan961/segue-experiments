import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { CompAllocation } from 'prisma/generated/prisma-client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newAlloc = req.body as CompAllocation;
    const dbClient = await getPrismaClient(req);

    const createResponse = await dbClient.compAllocation.create({
      data: {
        AvailableComp: {
          connect: {
            Id: newAlloc.AvailableCompId,
          },
        },
        TicketHolderName: newAlloc.TicketHolderName,
        Seats: newAlloc.Seats,
        Comments: newAlloc.Comments,
        RequestedBy: newAlloc.RequestedBy,
        VenueConfirmationNotes: newAlloc.VenueConfirmationNotes,
        TicketHolderEmail: newAlloc.TicketHolderEmail,
        SeatsAllocated: newAlloc.SeatsAllocated,
        ArrangedByAccUserId: newAlloc.ArrangedByAccUserId,
      },
    });

    res.status(200).json({ id: createResponse.Id });
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating CompAllocation' });
  }
}
