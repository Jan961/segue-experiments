import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from 'lib/prisma';
import { getEmailFromReq, checkAccess } from 'services/userService';

const ProductionSchema = yup.object().shape({
  id: yup.number().required(),
  showId: yup.number().optional(),
  code: yup.string().optional(),
  isArchived: yup.boolean().optional(),
  image: yup
    .object()
    .shape({
      id: yup.number().optional(),
      imageUrl: yup.string().url().optional(),
      name: yup.string().optional(),
    })
    .nullable()
    .optional(),
  company: yup.number().optional(),
  runningTime: yup.string().optional(),
  runningTimeNote: yup.string().nullable().optional(),
  currency: yup.string().optional(),
  salesEmail: yup.string().email().nullable().optional(),
  salesFrequency: yup.string().optional(),
  regionList: yup.array().of(yup.number()).optional(),
  dateBlockList: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().optional(),
        startDate: yup.string().optional(),
        endDate: yup.string().optional(),
        isPrimary: yup.boolean().optional(),
      }),
    )
    .optional(),
});

const prepareUpdateData = async ({
  id,
  // showId,
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
  // if (showId !== undefined) updateData.ShowId = showId;
  if (code !== undefined) updateData.Code = code;
  if (isArchived !== undefined) updateData.IsArchived = isArchived;
  if (runningTime !== undefined) {
    if (runningTime) {
      const [hours, minutes] = runningTime.split(':');
      updateData.RunningTime = new Date(Date.UTC(1970, 0, 1, hours, minutes));
    } else {
      updateData.RunningTime = null;
    }
  }
  if (runningTimeNote !== undefined) updateData.RunningTimeNote = runningTimeNote;
  if (salesEmail !== undefined) updateData.SalesEmail = salesEmail;
  if (salesFrequency !== undefined) updateData.SalesFrequency = salesFrequency;
  if (currency !== undefined) {
    if (currency === null) {
      updateData.Currency = {
        disconnect: true,
      };
    } else {
      updateData.Currency = {
        connect: {
          Code: currency,
        },
      };
    }
  }
  if (image !== undefined) {
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
  if (regionList !== undefined) {
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

  if (dateBlockList !== undefined) {
    const existingDateBlockIds = dateBlockList.filter((db) => db.Id).map((db) => db.Id);
    const existingDateBlocks = dateBlockList.filter((db) => db.Id);
    const newDateBlocks = dateBlockList.filter((db) => !db.Id);
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

  if (company !== undefined) {
    if (company === null) {
      updateData.ProductionCompany = {
        disconnect: true,
      };
    } else {
      updateData.ProductionCompany = {
        connect: {
          Id: company,
        },
      };
    }
  }
  return updateData;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId: req.body.id });
    if (!access) return res.status(401).end();
    // Validate the incoming payload
    const validatedData = await ProductionSchema.validate(req.body, { abortEarly: false });
    const updateData = await prepareUpdateData(req.body);
    // Update the production record
    const updatedProduction = await prisma.production.update({
      where: { Id: validatedData.id },
      data: updateData,
    });
    res.status(200).json(updatedProduction);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
