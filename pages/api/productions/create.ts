import { ProductionDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
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
}) => ({
  Id,
  Code,
  IsArchived,
  SalesEmail,
  SalesFrequency,
  ShowId,
  RegionList,
  Image,
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
  const { ShowId, Image } = production;

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ShowId });
  if (!access) return res.status(401).end();

  try {
    await prisma.production.create({
      data: {
        Code: production.Code,
        IsArchived: production.IsArchived,
        ShowId: production.ShowId,
        SalesFrequency: production.SalesFrequency,
        SalesEmail: production.SalesEmail,
        ProductionRegion: {
          create: production.RegionList.map((regionId) => ({
            PRRegionId: regionId,
          })),
        },
        ProductionImageFileId: Image?.id,
        DateBlock: {
          create: production.DateBlock.map((dateBlock) => ({
            Name: dateBlock.Name,
            StartDate: new Date(dateBlock.StartDate),
            EndDate: new Date(dateBlock.EndDate),
          })),
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
