import prisma from 'lib/prisma'

export default async function handle(req, res) {
  try {
    let bookingId:number = parseInt(req.query.bookingId);
    const updateResult = await prisma.contract.updateMany({
      where: {
        BookingId: bookingId,
      },
      data: {
       BarringClauseBreaches: req.body.BarringClauseBreaches
      },
    });

    await res.json(updateResult);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occurred while generating search results." });
  }
}
