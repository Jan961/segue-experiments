import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    let data = null;
    let result = null;

    if (req.body.type === 'Hold') {
      // get current values across weeks from the entered week
      data = await prisma.salesSet.findMany({
        where: {
          SetBookingId: req.body.bookingId,
          SetSalesFiguresDate: {
            gt: new Date(req.body.saleDate), // Use "greater than" for the date comparison
          },
          SetHold: {
            some: {
              SetHoldHoldTypeId: req.body.typeId, // Directly referencing the foreign key field
            },
          },
        },
      });

      result = data
        .sort((a, b) => new Date(a.SetSalesFiguresDate).getTime() - new Date(b.SetSalesFiguresDate).getTime())
        .filter((element, index, array) => index === 0 || element.SetHoldSeats === array[0].SetHoldSeats);
    } else {
      const data = await prisma.salesSet.findMany({
        where: {
          SetBookingId: req.body.bookingId,
          SetSalesFiguresDate: {
            gt: new Date(req.body.saleDate),
          },
          SetComp: {
            some: {
              compType: {
                compTypeId: req.body.typeId,
              },
            },
          },
        },
        include: {
          SetComp: {
            include: {
              CompType: true,
            },
          },
        },
        orderBy: [
          {
            SetComp: {
              compType: {
                compTypeName: 'asc',
              },
            },
          },
          {
            SetSalesFiguresDate: 'asc',
          },
        ],
      });

      result = data
        .sort((a, b) => new Date(a.SetSalesFiguresDate).getTime() - new Date(b.SetSalesFiguresDate).getTime())
        .filter((element, index, array) => index === 0 || element.SetCompSeats === array[0].SetCompSeats);
    }

    res.status(200).json(result);
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
