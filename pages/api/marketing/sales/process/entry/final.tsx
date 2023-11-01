import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    let result = await prisma.bookingSale.create({
      data: {
        BookingId: parseInt(req.body.BookingId), //hold link to Venue/Date
        SalesFiguresDate: new Date(),
        NumSeatsSold: parseInt(req.body.SeatsSold),
        SoldSeatsValue: parseFloat(req.body.SeatsSoldValue),
        NumSchoolSeatsSold: parseInt(req.body.SchoolsSeatsSold),
        SoldSchoolSeatsValue: parseFloat(req.body.SchoolsSeatsSoldValue),
        FinalFigures: true,
        IsCopy: false,
      },
    });

    res.json(result);
    res.status(200);
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
