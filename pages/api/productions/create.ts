import { NextApiRequest, NextApiResponse } from 'next';
import { pick } from 'radash';
import * as yup from 'yup';
import getPrismaClient from 'lib/prisma';
import { isNullOrUndefined } from 'utils';
import { productionSchema } from 'validators/production';
import { UTCDate } from '@date-fns/utc';
import { newDate } from 'services/dateService';

const processRunningTm = (strTime) => {
  if (isNullOrUndefined(strTime)) {
    return null;
  }

  const [hours, minutes] = strTime.split(':');
  return newDate(UTCDate.UTC(1970, 0, 1, hours, minutes));
};

const mapToPrismaFields = ({
  code: Code,
  isArchived: IsArchived = false,
  showId: ShowId,
  salesFrequency: SalesFrequency,
  salesEmail: SalesEmail,
  regionList: RegionList,
  dateBlockList,
  id: Id,
  image: Image,
  runningTime: RunningTime,
  runningTimeNote: RunningTimeNote,
  currency: ReportCurrencyCode,
  company: ProdCoId,
}) => ({
  Id,
  Code,
  IsArchived,
  SalesEmail,
  SalesFrequency,
  ShowId,
  RegionList,
  Image,
  ProdCoId,
  ReportCurrencyCode,
  RunningTime: processRunningTm(RunningTime),
  RunningTimeNote,
  DateBlock: dateBlockList.map(
    ({ name: Name, startDate: StartDate, endDate: EndDate, isPrimary: IsPrimary, id: Id }) => ({
      Name,
      StartDate,
      EndDate,
      IsPrimary,
      Id,
    }),
  ),
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const production = mapToPrismaFields(req.body);
  const { ShowId, Image } = production;
  const prisma = await getPrismaClient(req);
  await productionSchema(true).validate(req.body, { abortEarly: false });
  try {
    await prisma.production.create({
      data: {
        ...pick(production, [
          'Code',
          'IsArchived',
          'SalesFrequency',
          'SalesEmail',
          'RunningTime',
          'RunningTimeNote',
          'ReportCurrencyCode',
          'ProdCoId',
        ]),
        ProductionRegion: {
          create: production.RegionList.map((regionId) => ({
            PRRegionId: regionId,
          })),
        },
        DateBlock: {
          create: production.DateBlock.map((dateBlock) => ({
            Name: dateBlock.Name,
            StartDate: newDate(dateBlock.StartDate),
            EndDate: newDate(dateBlock.EndDate),
            IsPrimary: dateBlock.IsPrimary,
          })),
        },
        ...(!isNullOrUndefined(Image) && {
          File: {
            connect: {
              Id: Image?.id,
            },
          },
        }),
        Show: {
          connect: {
            Id: ShowId,
          },
        },
      },
    });

    res.status(200).end();
  } catch (error) {
    if (error.code === 'P2002' && error.meta && error.meta.target.includes('SECONDARY')) {
      // The target might not exactly match 'SECONDARY', depending on Prisma version and database
      res.status(409).json({ error: 'A Production with the specified ShowId and Code already exists.', ok: false });
    } else if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      res.status(500).json({ err: 'Error occurred while creating production.', ok: false });
    }
  }
}
