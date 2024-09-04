import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import prisma from 'lib/prisma';
import { prepareAccountUpdateData, prepareAgencyOrganisationUpdateData } from 'services/contracts';
import { preparePersonUpdateData, updatePerson } from 'services/person';
import { updatePersonSchema } from 'validators/person';
import { ERROR_CODES } from 'config/apiConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = await updatePersonSchema.validate(req.body, { abortEarly: false });

    const {
      personDetails,
      agencyDetails,
      salaryAccountDetails,
      expenseAccountDetails,
      emergencyContact1,
      emergencyContact2,
    } = validatedData;

    await prisma.$transaction(async (tx) => {
      const updateMainPersonData = {
        ...prepareAccountUpdateData(salaryAccountDetails, true),
        ...prepareAccountUpdateData(expenseAccountDetails, false),
        ...preparePersonUpdateData(personDetails),
      };
      const personUpdates = [
        updatePerson(personDetails.id, updateMainPersonData, tx),
        agencyDetails && agencyDetails.agencyPersonId
          ? updatePerson(agencyDetails.agencyPersonId, preparePersonUpdateData(agencyDetails), tx)
          : null,
        emergencyContact1 && emergencyContact1.id
          ? updatePerson(emergencyContact1.id, preparePersonUpdateData(emergencyContact1), tx)
          : null,
        emergencyContact2 && emergencyContact2.id
          ? updatePerson(emergencyContact2.id, preparePersonUpdateData(emergencyContact2), tx)
          : null,
      ].filter(Boolean);

      await Promise.all(personUpdates);

      if (agencyDetails && agencyDetails.agencyPersonId) {
        const agencyOrganisationUpdateData = prepareAgencyOrganisationUpdateData(agencyDetails);
        await tx.organisation.update({
          where: { OrgContactPersonId: agencyDetails.agencyPersonId },
          data: agencyOrganisationUpdateData,
        });
      }
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
