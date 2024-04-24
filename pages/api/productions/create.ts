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
}) => ({
  Id,
  Code,
  IsArchived,
  SalesEmail,
  SalesFrequency,
  ShowId,
  RegionList,
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
  const { ShowId } = production;

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
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating production.' });
  }
}
