import { ProductionDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { pick } from 'radash';
import { getEmailFromReq, checkAccess } from 'services/userService';

export const mapToPrismaFields = ({
  code: Code,
  isArchived: IsArchived,
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
  RunningTime,
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
  const production: Partial<ProductionDTO> = mapToPrismaFields(req.body);
  const { ShowId, Image, ReportCurrencyCode, ProdCoId } = production;

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ShowId });
  if (!access) return res.status(401).end();

  try {
    await prisma.production.create({
      data: {
        ...pick(production, ['Code', 'IsArchived', 'SalesFrequency', 'SalesEmail', 'RunningTimeNote']),
        ProductionRegion: {
          create: production.RegionList.map((regionId) => ({
            PRRegionId: regionId,
          })),
        },
        DateBlock: {
          create: production.DateBlock.map((dateBlock) => ({
            Name: dateBlock.Name,
            StartDate: new Date(dateBlock.StartDate),
            EndDate: new Date(dateBlock.EndDate),
            IsPrimary: dateBlock.IsPrimary,
          })),
        },
        ...(Image?.id && {
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
        Currency: {
          connect: {
            Code: ReportCurrencyCode,
          },
        },
        ProductionCompany: {
          connect: {
            Id: ProdCoId,
          },
        },
      },
    });

    res.status(200).end();
  } catch (error) {
    console.log(error);
    if (error.code === 'P2002' && error.meta && error.meta.target.includes('SECONDARY')) {
      // The target might not exactly match 'SECONDARY', depending on Prisma version and database
      res.status(409).json({ error: 'A Production with the specified ShowId and Code already exists.', ok: false });
    } else {
      res.status(500).json({ err: 'Error occurred while creating production.', ok: false });
    }
  }
}
