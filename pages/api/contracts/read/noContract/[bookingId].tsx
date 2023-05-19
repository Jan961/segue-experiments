import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {
        let bookingId = req.query.bookingId
        const searchResults = await prisma.booking.findMany({
            include: {
              Contract: {
                include:{
                  ContractArtifacts:{
                    include:{
                      AttachedFile:true
                    }
                  }
                }
              },
              Venue:true
            },
            where: {
              BookingId: parseInt(bookingId)
            },
          });
          

        await res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}


