import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { CompAllocation } from 'prisma/generated/prisma-client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const updAlloc = req.body as CompAllocation;
    const sqlClient = await getPrismaClient(req);

    const updResponse = await sqlClient.compAllocation.update({
      where: {
        Id: updAlloc.Id,
      },
      data: {
        AvailableComp: {
          connect: {
            Id: updAlloc.AvailableCompId,
          },
        },
        TicketHolderName: updAlloc.TicketHolderName,
        Seats: updAlloc.Seats,
        Comments: updAlloc.Comments,
        RequestedBy: updAlloc.RequestedBy,
        VenueConfirmationNotes: updAlloc.VenueConfirmationNotes,
        TicketHolderEmail: updAlloc.TicketHolderEmail,
        SeatsAllocated: updAlloc.SeatsAllocated,
        ArrangedByAccUserId: updAlloc.ArrangedByAccUserId,
      },
    });

    res.status(200).json({ id: updResponse.Id });
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating CompAllocation' });
  }
}
