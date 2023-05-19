import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {

        let bookingId = parseInt(req.query.bookingID)
        const searchResults = await prisma.bookingSale.findMany({
            where: {
                BookingId: bookingId,
            }
        })

        res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }
}

//single methods, lets getting query variable into local variables, prisma consturct gets a list of 
//show id's

//Performances folder/[bookingid]where booking id parses bookingid 
//dummy data in table
//localhost:3000/api/bookings/performances/performanceID
