import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import * as yup from 'yup';
import { isEmpty, omit, pick } from 'radash';
import { prepareAddressQueryData, prepareOrganisationQueryData, preparePersonQueryData } from 'services/personService';
import { createPersonSchema } from 'validators/person';
import { addressFields, organisationFields } from 'services/person';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const prisma = await getPrismaClient(req);

    const validatedData = await createPersonSchema.validate(req.body, { abortEarly: false });

    const {
      personDetails,
      agencyDetails,
      emergencyContact1,
      emergencyContact2,
      salaryAccountDetails,
      expenseAccountDetails,
    } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      let agencyPersonId = null;
      let organisationId = null;
      if (!isEmpty(agencyDetails)) {
        const agencyPersonAddressData = prepareAddressQueryData(pick(agencyDetails, addressFields), true);
        const agencyPersonData = preparePersonQueryData(
          omit(agencyDetails, [...addressFields, ...organisationFields]),
          null,
          null,
          undefined,
          undefined,
          true,
        );
        const formattedAgencyPersonData = agencyPersonData.map((p) => ({
          ...p,
          Address: { create: agencyPersonAddressData },
        }));
        if (agencyPersonData) {
          const agencyPerson = await tx.person.create({
            data: {
              ...formattedAgencyPersonData,
            },
          });
          agencyPersonId = agencyPerson.PersonId;
        }
        const organisationData = prepareOrganisationQueryData(
          pick(agencyDetails, organisationFields),
          agencyPersonId,
          true,
        );
        const formattedOrganisationData = organisationData.map((o) => ({
          ...o,
        }));
        if (organisationData) {
          const organisation = await tx.organisation.create({
            data: formattedOrganisationData,
          });
          organisationId = organisation.OrgId;
        }
      }

      const emergencyContactList = [];
      if (!isEmpty(emergencyContact1)) {
        const emergencyContactAddressData = prepareAddressQueryData(pick(emergencyContact1, addressFields), true);
        const emergencyContactData = preparePersonQueryData(
          omit(emergencyContact1, addressFields),
          null,
          null,
          undefined,
          undefined,
          true,
        );
        const formattedEmergencyContactData = emergencyContactData.map((p) => ({
          ...p,
          Address: { create: emergencyContactAddressData },
        }));
        const emergencyContact1Person = await tx.person.create({
          data: formattedEmergencyContactData,
        });
        emergencyContactList.push(emergencyContact1Person.PersonId);
      }

      if (!isEmpty(emergencyContact2)) {
        const emergencyContactAddressData = prepareAddressQueryData(pick(emergencyContact1, addressFields), true);
        const emergencyContactData = preparePersonQueryData(
          omit(emergencyContact1, addressFields),
          null,
          null,
          undefined,
          undefined,
          true,
        );
        const formattedEmergencyContactData = emergencyContactData.map((p) => ({
          ...p,
          Address: { create: emergencyContactAddressData },
        }));
        const emergencyContact2Person = await tx.person.create({
          data: formattedEmergencyContactData,
        });
        emergencyContactList.push(emergencyContact2Person.PersonId);
      }

      const personAddressData = prepareAddressQueryData(pick(personDetails, addressFields), true);
      const personData = preparePersonQueryData(
        omit(personDetails, addressFields),
        null,
        organisationId,
        salaryAccountDetails,
        expenseAccountDetails,
        true,
      );

      const formattedPersonData = personData.map((p) => ({
        ...p,
        Address: { create: personAddressData },
      }));
      const mainPerson = await tx.person.create({
        data: formattedPersonData,
      });

      if (emergencyContactList.length) {
        await tx.personPerson.createMany({
          data: emergencyContactList.map((ContactId) => ({
            PPRoleType: 'emergencycontact',
            PPPersonId: mainPerson.PersonId,
            PPRolePersonId: ContactId,
          })),
        });
      }
      return mainPerson;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
