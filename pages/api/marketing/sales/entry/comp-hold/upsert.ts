import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const prisma = await getPrismaClient(req);
    let { setId, bookingId, salesDate } = req.body;

    if (setId === -1) {
      const setResult = await prisma.salesSet.create({
        data: {
          SetBookingId: parseInt(bookingId),
          SetPerformanceId: null,
          SetSalesFiguresDate: salesDate,
          SetBrochureReleased: false,
          SetSingleSeats: false,
          SetNotOnSale: false,
          SetIsFinalFigures: false,
          SetIsCopy: false,
        },
      });

      setId = setResult.SetId;
    }

    if (req.body.type === 'Holds') {
      // check for an existing record
      const currentHold = await prisma.setHold.findFirst({
        where: {
          SetHoldSetId: setId,
          SetHoldHoldTypeId: req.body.data.id,
        },
      });

      if (currentHold !== null) {
        await prisma.setHold.update({
          where: { SetHoldId: currentHold.SetHoldId },
          data: {
            SetHoldSeats: req.body.field === 'seats' ? parseInt(req.body.value) : currentHold.SetHoldSeats,
            SetHoldValue: req.body.field === 'value' ? parseFloat(req.body.value) : currentHold.SetHoldValue,
          },
        });
      } else {
        await prisma.setHold.create({
          data: {
            SetHoldSetId: setId,
            SetHoldHoldTypeId: req.body.data.id,
            SetHoldSeats: req.body.field === 'seats' ? parseInt(req.body.value) : 0,
            SetHoldValue: req.body.field === 'value' ? parseFloat(req.body.value) : 0,
          },
        });
      }
    } else if (req.body.type === 'Comps') {
      // check for an existing record
      const currentComp = await prisma.setComp.findFirst({
        where: {
          SetCompSetId: setId,
          SetCompCompTypeId: req.body.data.id,
        },
      });

      if (currentComp !== null) {
        await prisma.setComp.update({
          where: { SetCompId: currentComp.SetCompId },
          data: {
            SetCompSeats: req.body.field === 'seats' ? parseInt(req.body.value) : currentComp.SetCompSeats,
          },
        });
      } else {
        await prisma.setComp.create({
          data: {
            SetCompSetId: setId,
            SetCompCompTypeId: req.body.data.id,
            SetCompSeats: req.body.field === 'seats' ? parseInt(req.body.value) : 0,
          },
        });
      }
    }

    res.status(200).json({ setId });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
