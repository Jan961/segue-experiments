import { bookingMapper, performanceMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { loggingService } from 'services/loggingService';
// import { checkAccess, getEmailFromReq } from 'services/userService';

export interface AddBookingsParams {
  Date: string;
  DateBlockId: number;
  VenueId: number;
  performanceTimes: string[];
}

export default async function handle(req, res) {
  try {
    const BookingsData = req.body as AddBookingsParams[];
    const promises=[];
    const bookings=[];
    let performances = [];
    await prisma.$transaction(async (tx) => {
        for(const BookingData of BookingsData) {
            const {DateBlockId, VenueId, Date:bookingDate, performanceTimes=[]} = BookingData||{};
            const performances = performanceTimes.map(time => ({
                create: {
                    Time: new Date(`${bookingDate}T${time}`),
                    Date: new Date(bookingDate),
                },
            }));
            const created = tx.booking.create({
                data:{
                    FirstDate:new Date(bookingDate),
                    DateBlock: {
                        connect: {
                        Id: DateBlockId,
                        },
                    },
                    Venue: {
                        connect: {
                        Id: VenueId,
                        },
                    },
                    Performance: {
                        createMany: {
                            data: performances.map(p => p.create)
                        }
                    },
                },
                include:{
                    Performance:true,
                    Venue:true
                }
            })
            promises.push(created)
        }
        const createdBookings = await Promise.allSettled(promises);
        for(const createdBooking of createdBookings) {
            if(createdBooking.status==='fulfilled'){
                bookings.push(bookingMapper(createdBooking.value));
                performances = performances.concat(createdBooking.value.Performance.map(performance=>performanceMapper(performance)))
            }
        }
        return createdBookings;
    })
    
    // const { DateBlockId, VenueId } = data;

    // const email = await getEmailFromReq(req);
    // const access = await checkAccess(email, { DateBlockId });
    // if (!access) return res.status(401).end();

    // const created = await createBooking(VenueId, new Date(data.Date), DateBlockId);
    res.status(200).json({bookings, performances});
  } catch (e) {
    console.log("==Error==", e)
    console.log(e);
    await loggingService.logError(e);
    res.status(500).json({ err: 'Error creating booking' });
  }
}
