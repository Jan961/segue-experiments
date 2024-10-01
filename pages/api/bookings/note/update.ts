import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
let prisma = null;
const updateNoteInBookings = async (Id: number, Notes: string) => {
  await prisma.booking.update({
    data: {
      Notes,
    },
    where: {
      Id,
    },
  });
};

const updateNoteInGIFU = async (Id: number, Notes: string) => {
  await prisma.getInFitUp.update({
    data: {
      Notes,
    },
    where: {
      Id,
    },
  });
};

const updateNoteInRehearsal = async (Id: number, Notes: string) => {
  await prisma.rehearsal.update({
    data: {
      Notes,
    },
    where: {
      Id,
    },
  });
};

const updateNoteInOther = async (Id: number, Notes: string) => {
  await prisma.other.update({
    data: {
      Notes,
    },
    where: {
      Id,
    },
  });
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    prisma = await getPrismaClient(req);
    const booking = req.body;
    const { Id, note, dayType } = booking;

    switch (dayType) {
      case 'Performance':
        await updateNoteInBookings(Id, note);
        break;
      case 'Rehearsal':
        await updateNoteInRehearsal(Id, note);
        break;
      case 'Get in / Fit Up':
        await updateNoteInGIFU(Id, note);
        break;
      default:
        await updateNoteInOther(Id, note);
    }

    res.status(200).json(booking);
  } catch (e) {
    res.status(500).json({ err: 'Error updating note' });
  }
}
