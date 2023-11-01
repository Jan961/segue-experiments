import prisma from 'lib/prisma';

export default async function handle(req, res) {
  //console.log(req.data)
  try {
    let result = await prisma.bookingSaleNotes.create({
      data: {
        BookingSaleId: req.data.BookingSaleId,
        HoldNotes: req.data.HoldNotes,
        CompNotes: req.data.CompNotes,
        BookingSaleNotes: req.data.BookingSaleNotes,
      },
    });
    // console.log(result)
    res.json(result);
    res.status(200);
    // Return the inserted ID it is needed for related foreach inserts
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
