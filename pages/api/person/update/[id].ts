import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import getPrismaClient from 'lib/prisma';
import { handleAgencyDetails, handleEmergencyContacts, upsertPerson } from 'services/person';
import { updatePersonSchema } from 'validators/person';
import { ERROR_CODES } from 'config/apiConfig';
import { all } from 'radash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const prisma = await getPrismaClient(req);
    const validatedData = await updatePersonSchema.validate(req.body, { abortEarly: false });

    await prisma.$transaction(async (tx) => {
      // Process the personDetails
      const {
        personDetails,
        agencyDetails,
        salaryAccountDetails,
        expenseAccountDetails,
        emergencyContact1,
        emergencyContact2,
      } = validatedData;

      // Update or create the main person record
      const updatedPerson = await upsertPerson(personDetails, salaryAccountDetails, expenseAccountDetails, tx);

      await all([
        handleAgencyDetails(personDetails.id, agencyDetails, tx),
        handleEmergencyContacts(personDetails.id, emergencyContact1, emergencyContact2, tx),
      ]);

      res.status(200).json({ message: 'Person updated successfully', updatedPerson });
    });

    res.status(200).json({ message: 'Person and related details updated successfully', ok: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res
        .status(400)
        .json({ message: 'Validation error', errors: error.errors, code: ERROR_CODES.VALIDATION_ERROR });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
