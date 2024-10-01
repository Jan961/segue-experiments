import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import * as yup from 'yup';
import { isNullOrUndefined, isUndefined } from 'utils';
import { productionSchema } from 'validators/production';

let prisma = null;

const prepareUpdateData = async ({
  id,
  code,
  isArchived,
  image,
  company,
  runningTime,
  runningTimeNote,
  currency,
  salesEmail,
  salesFrequency,
  regionList,
  dateBlockList,
}) => {
  const updateData: any = {};
  if (!isNullOrUndefined(code)) updateData.Code = code;
  if (!isNullOrUndefined(isArchived)) updateData.IsArchived = isArchived;
  if (!isUndefined(runningTime)) {
    if (runningTime) {
      const [hours, minutes] = runningTime.split(':');
      updateData.RunningTime = new Date(Date.UTC(1970, 0, 1, hours, minutes));
    } else {
      updateData.RunningTime = null;
    }
  }
  if (!isUndefined(runningTimeNote)) updateData.RunningTimeNote = runningTimeNote;
  if (!isUndefined(salesEmail)) updateData.SalesEmail = salesEmail;
  if (!isUndefined(salesFrequency)) updateData.SalesFrequency = salesFrequency;
  if (!isUndefined(currency)) {
    updateData.ReportCurrencyCode = currency;
  }
  if (!isUndefined(image)) {
    if (image === null) {
      updateData.File = {
        disconnect: true,
      };
    } else if (image.id) {
      updateData.File = {
        connect: {
          Id: image.id,
        },
      };
    }
  }
  if (!isUndefined(regionList)) {
    const existingRegions = await prisma.ProductionRegion.findMany({
      where: { PRProductionId: id },
      select: { PRRegionId: true },
    });
    const existingRegionIds = existingRegions.map((region) => region.PRRegionId);

    // Determine regions to remove
    const regionsToRemove = existingRegionIds.filter((regionId) => !regionList.includes(regionId));
    const newRegions = regionList.filter((regionId) => !existingRegionIds.includes(regionId));
    updateData.ProductionRegion = {
      deleteMany: {
        PRRegionId: { in: regionsToRemove },
      },
      create: newRegions.map((regionId) => ({
        PRRegionId: regionId,
      })),
    };
  }

  if (!isUndefined(dateBlockList)) {
    const existingDateBlockIds = dateBlockList.filter((db) => db.id).map((db) => db.id);
    const existingDateBlocks = dateBlockList.filter((db) => db.id);
    const newDateBlocks = dateBlockList.filter((db) => !db.id);
    updateData.DateBlock = {
      // Remove DateBlocks not in the DTO
      deleteMany: {
        NOT: { Id: { in: existingDateBlockIds } },
        ProductionId: id,
      },
      // Update existing DateBlocks
      updateMany: existingDateBlocks.map((db) => ({
        where: { Id: db.id, ProductionId: id },
        data: {
          StartDate: new Date(db.startDate),
          EndDate: new Date(db.endDate),
          Name: db.name,
          IsPrimary: db.isPrimary,
        },
      })),
      // Create new DateBlocks. This has to come last (otherwise deleteMany will remove)
      create: newDateBlocks.map((db) => ({
        StartDate: new Date(db.startDate),
        EndDate: new Date(db.endDate),
        Name: db.name,
        IsPrimary: db.isPrimary,
      })),
    };
  }

  if (!isUndefined(company)) {
    updateData.ProdCoId = company;
  }
  return updateData;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    prisma = await getPrismaClient(req);
    // Validate the incoming payload
    const validatedData = await productionSchema().validate(req.body, { abortEarly: false });
    // Ensure the Production record exists
    const productionExists = await prisma.production.findUnique({
      where: { Id: req.body?.id },
    });

    if (!productionExists) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    const updateData = await prepareUpdateData(req.body);
    // Update the production record
    const updatedProduction = await prisma.production.update({
      where: { Id: validatedData.id },
      data: updateData,
    });
    res.status(200).json(updatedProduction);
  } catch (error) {
    console.log(error);
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
