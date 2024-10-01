import getPrismaClient from 'lib/prisma';
import { getDuration } from './dateService';
import { getFileUrlFromLocation } from 'utils/fileUpload';
import { NextApiRequest } from 'next';

export const getReportsList = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.performanceReport.findMany({
    select: {
      Id: true,
      // CreatedAt: true,
      Performance: {
        select: {
          Id: true,
          Time: true,
          Date: true,
          Booking: {
            select: {
              Id: true,
              Venue: {
                select: {
                  Id: true,
                  Code: true,
                  Name: true,
                },
              },
              DateBlock: {
                select: {
                  Production: {
                    select: {
                      Show: {
                        select: {
                          Id: true,
                          Name: true,
                          Code: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getPerformanceReportById = async (Id: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.performanceReport.findFirst({
    where: {
      Id,
    },
    select: {
      Id: true,
      PerformanceId: true,
      Act1UpTime: true,
      Act1DownTime: true,
      Interval1UpTime: true,
      Interval1DownTime: true,
      Act2UpTime: true,
      Act2DownTime: true,
      GetOutTime: true,
      GetOutUpTime: true,
      GetOutDownTime: true,
      Absences: true,
      Illness: true,
      TechnicalNotes: true,
      PerformanceNotes: true,
      SetPropCostumeNotes: true,
      AudienceNotes: true,
      MerchandiseNotes: true,
      GeneralRemarks: true,
      // CSM: true,
      // Lighting: true,
      // ASM: true,
      // CreatedAt: true,
      // UpdatedAt: true,
      Performance: {
        select: {
          Id: true,
          Time: true,
          Date: true,
          Booking: {
            select: {
              Id: true,
              Venue: {
                select: {
                  Id: true,
                  Code: true,
                  Name: true,
                },
              },
              DateBlock: {
                select: {
                  Production: {
                    select: {
                      File: {
                        select: {
                          Id: true,
                          OriginalFilename: true,
                          Location: true,
                        },
                      },
                      Show: {
                        select: {
                          Id: true,
                          Name: true,
                          Code: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const extractTime = (dateTime: Date | null | undefined): string | undefined => {
  if (dateTime instanceof Date) {
    return dateTime.toISOString().slice(11, 16);
  }
  return undefined;
};

export const transformPerformanceReport = (report: any): any => {
  const actOneUpTime = extractTime(report?.Act1UpTime) || report?.Act1UpTime?.toISOString?.() || '';
  const actOneDownTime = extractTime(report?.Act1DownTime) || report?.Act1DownTime?.toISOString?.() || '';
  const actTwoUpTime = extractTime(report?.Act2DownTime) || report?.Act2UpTime?.toISOString?.() || '';
  const actTwoDownTime = extractTime(report?.Act2DownTime) || report?.Act2DownTime?.toISOString?.() || '';
  const intervalUpTime = extractTime(report?.Interval1UpTime) || report?.Interval1UpTime?.toISOString?.() || '';
  const intervalDownTime = extractTime(report?.Interval1DownTime) || report?.Interval1DownTime?.toISOString?.() || '';
  const getOutTime = extractTime(report?.GetOutTime) || report?.GetOutTime?.toISOString?.() || '';
  const getOutUpTime = extractTime(report?.GetOutUpTime) || report?.GetOutUpTime?.toISOString?.() || '';
  const getOutDownTime = extractTime(report?.GetOutDownTime) || report?.GetOutDownTime?.toISOString?.() || '';
  const createdAt = report?.CreatedAt?.toISOString?.() || '';
  const performanceDate = report?.Performance?.Date?.toISOString?.() || '';
  const performanceTime = report?.Performance?.Time?.toISOString?.() || '';
  const productionImage = report?.Performance?.Booking?.DateBlock?.Production?.File;
  const imageUrl = productionImage?.Location ? getFileUrlFromLocation(productionImage?.Location) : '';
  return {
    id: report?.Id,
    reportNumber: report?.Id,
    actOneUpTime,
    actOneDownTime,
    actTwoDownTime,
    intervalDownTime,
    getOutTime,
    createdAt,
    castCrewAbsence: report?.Absences,
    castCrewInjury: report?.Illness,
    dutyTechnician: report?.TechnicalNotes,
    technicalNote: report?.TechnicalNotes,
    performanceNote: report?.PerformanceNotes,
    setPropCustumeNote: report?.SetPropCostumeNotes,
    audienceNote: report?.AudienceNotes,
    merchandiseNote: report?.MerchandiseNotes,
    generalRemarks: report?.GeneralRemarks,
    distributionList: report?.DistributionList || [],
    venue: report?.Performance?.Booking?.Venue?.Name,
    town: report?.Performance?.Booking?.Venue?.Code,
    lighting: report?.Lighting || '',
    actTwoDuration: getDuration(actTwoUpTime, actTwoDownTime),
    actOneDuration: getDuration(actOneUpTime, actOneDownTime),
    intervalDuration: getDuration(intervalUpTime, intervalDownTime),
    getOutDuration: getDuration(getOutUpTime, getOutDownTime),
    asm: report?.ASM || '',
    cms: report?.CSM || '',
    reportImageUrl: imageUrl || '',
    performanceTime,
    performanceDate,
    performanceId: report?.Performance?.Id,
    bookingId: report?.Performance?.Booking?.Id,
  };
};
