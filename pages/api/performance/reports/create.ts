import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { dateStringToPerformancePair } from 'services/dateService';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { Report } from 'types/report';
import moment from 'moment';

const getDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':');
  return moment
    .utc(date)
    .set({ hour: parseInt(hours, 10), minute: parseInt(minutes, 10) })
    .toDate();
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const report = req.body as Report;
    const {
      actOneDownTime,
      // actOneDuration,
      actOneUpTime,
      actTwoDownTime,
      // actTwoDuration,
      // asm,
      audienceNote,
      bookingId,
      castCrewAbsence,
      castCrewInjury,
      // csm,
      // distributionList,
      // dutyTechnician,
      generalRemarks,
      // getOutDuration,
      getOutTime,
      intervalDownTime,
      // intervalDuration,
      // lighting,
      merchandiseNote,
      performanceDate,
      performanceId,
      performanceNote,
      // performanceTime,
      // reportImageUrl,
      setPropCustumeNote,
      technicalNote,
      // town,
      // venue,
    } = report;

    const { Date: date } = dateStringToPerformancePair(performanceDate);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: parseInt(bookingId, 10) });
    if (!access) return res.status(401).end();
    console.log(getDateTime(date, actOneUpTime), actOneUpTime);
    const result = await prisma.PerformanceReport.create({
      data: {
        PerformanceId: parseInt(performanceId, 10),
        Act1UpTime: getDateTime(date, actOneUpTime),
        Act1DownTime: getDateTime(date, actOneDownTime),
        Interval1UpTime: getDateTime(date, actOneDownTime),
        Interval1DownTime: getDateTime(date, intervalDownTime),
        Act2UpTime: getDateTime(date, intervalDownTime),
        Act2DownTime: getDateTime(date, actTwoDownTime),
        GetOutTime: getDateTime(date, getOutTime),
        GetOutUpTime: getDateTime(date, actTwoDownTime),
        GetOutDownTime: getDateTime(date, getOutTime),
        Absences: castCrewAbsence,
        Illness: castCrewInjury,
        TechnicalNotes: technicalNote,
        PerformanceNotes: performanceNote,
        SetPropCostumeNotes: setPropCustumeNote,
        AudienceNotes: audienceNote,
        MerchandiseNotes: merchandiseNote,
        GeneralRemarks: generalRemarks,
        // CSM: csm,
        // Lighting: lighting,
        // ASM: asm,
      },
    });
    console.log(`Created Performance Report: ${result.PRId}`);
    res.status(200).json({ ok: true, report: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error Creating Performance Report' });
  }
}
