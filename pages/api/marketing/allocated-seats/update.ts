import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { CompAllocation } from 'prisma/generated/prisma-client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as CompAllocation;
    const prisma = await getPrismaClient(req);

    await prisma.compAllocation.update({
      where: {
        Id: data.Id,
      },
      data: {
        AvailableComp: {
          connect: {
            Id: data.AvailableCompId,
          },
        },
        TicketHolderName: data.TicketHolderName,
        Seats: data.Seats,
        Comments: data.Comments,
        RequestedBy: data.RequestedBy,
        VenueConfirmationNotes: data.VenueConfirmationNotes,
        TicketHolderEmail: data.TicketHolderEmail,
        SeatsAllocated: data.SeatsAllocated,
        ArrangedByAccUserId: data.ArrangedByAccUserId,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating CompAllocation' });
  }
}
