import getPrismaClient from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { updateConversionRateByDetails, updateConversionRateById } from 'services/conversionRateService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const prisma = await getPrismaClient(req);
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400).json({ message: 'Missing or invalid updates array' });
    return;
  }

  const errors: string[] = [];

  try {
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        const { id, fromCurrencyCode, toCurrencyCode, productionId, rate } = update;

        if (!rate || (!id && (!fromCurrencyCode || !toCurrencyCode || !productionId))) {
          errors.push('Missing required fields for update');
          continue;
        }

        if (id) {
          await updateConversionRateById(tx, { id, rate });
        } else {
          const result = await updateConversionRateByDetails(tx, {
            fromCurrencyCode,
            toCurrencyCode,
            productionId,
            rate,
          });

          if (result.count === 0) {
            errors.push(
              `No records found to update for FromCurrencyCode: ${fromCurrencyCode}, ToCurrencyCode: ${toCurrencyCode}, ProductionId: ${productionId}`,
            );
          }
        }
      }
    });

    if (errors.length > 0) {
      res.status(207).json({ message: 'Some updates failed', errors });
    } else {
      res.status(200).json({ message: 'All conversion rates updated successfully' });
    }
  } catch (error) {
    console.error('Error updating conversion rates:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;
