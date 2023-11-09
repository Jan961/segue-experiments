import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { dateStringToPerformancePair } from 'services/dateService';
import { performanceMapper } from 'lib/mappers';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { PerformanceReport } from '@prisma/client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const report = req.body as PerformanceReport;
    const { actOneDownTime,
      actOneDuration,
      actOneUpTime,
      actTwoDownTime,
      actTwoDuration,
      asm,
      audienceNote,
      bookingId,
      castCrewAbsence,
      castCrewInjury,
      cms,
      distributionList,
      dutyTechnician,
      generalRemarks,
      getOutDuration,
      getOutTime,
      intervalDownTime,
      intervalDuration,
      lighting,
      merchandiseNote,
      performanceDate,
      performanceId,
      performanceNote,
      performanceTime,
      reportImageUrl,
      setPropCustumeNote,
      technicalNote,
      town,
      venue,
     } = report;

    const { Date, Time } = dateStringToPerformancePair(perf.Date);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    const result = await prisma.performance.create({
      data: {
        Date,
        Time,
        Booking: {
          connect: {
            Id: perf.BookingId,
          },
        },
      },
    });
    console.log(`Created Performance: ${result.Id}`);
    res.status(200).json(performanceMapper(result));
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error Creating Performance' });
  }
}