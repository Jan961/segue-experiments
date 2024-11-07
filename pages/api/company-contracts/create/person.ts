import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import * as yup from 'yup';
import { all, isEmpty, omit, pick } from 'radash';
import { prepareAddressQueryData, prepareOrganisationQueryData, preparePersonQueryData } from 'services/personService';
import { createPersonSchema } from 'validators/person';
import { addressFields, organisationFields } from 'services/person';
import { PrismaClient } from 'prisma/generated/prisma-client';

// Helper function to create a person with address
async function createPersonWithAddress(tx: PrismaClient, personData, addressData) {
  if (!personData?.PersonFirstName) {
    return null;
  }

  const createData = {
    PersonFirstName: personData.PersonFirstName,
    ...personData,
    ...(addressData && {
      Address: {
        create: addressData,
      },
    }),
  };

  return await tx.person.create({ data: createData });
}

// Helper function to create organization
async function createOrganization(tx: PrismaClient, orgData) {
  if (!orgData?.OrgName) {
    return null;
  }

  return await tx.organisation.create({
    data: {
      OrgName: orgData.OrgName,
      ...orgData,
    },
  });
}

// Helper function to handle agency creation
async function handleAgencyCreation(tx: PrismaClient, agencyDetails) {
  if (isEmpty(agencyDetails)) {
    return { agencyPersonId: null, organisationId: null };
  }

  const agencyPersonAddressData = prepareAddressQueryData(pick(agencyDetails, addressFields), true);
  const agencyPersonData = preparePersonQueryData(
    omit(agencyDetails, [...addressFields, ...organisationFields]),
    null,
    null,
    undefined,
    undefined,
    true,
  );

  const agencyPerson = await createPersonWithAddress(tx, agencyPersonData, agencyPersonAddressData);
  const agencyPersonId = agencyPerson?.PersonId || null;

  const organisationData = prepareOrganisationQueryData(pick(agencyDetails, organisationFields), agencyPersonId, true);

  const organisation = await createOrganization(tx, organisationData);
  return {
    agencyPersonId,
    organisationId: organisation?.OrgId || null,
  };
}

// Helper function to create emergency contact
async function createEmergencyContact(tx: PrismaClient, contactDetails) {
  if (isEmpty(contactDetails)) {
    return null;
  }

  const contactAddressData = prepareAddressQueryData(pick(contactDetails, addressFields), true);
  const contactPersonData = preparePersonQueryData(
    omit(contactDetails, addressFields),
    null,
    null,
    undefined,
    undefined,
    true,
  );

  const contact = await createPersonWithAddress(tx, contactPersonData, contactAddressData);
  return contact?.PersonId || null;
}

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

    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      // Handle agency and organization creation
      const { organisationId } = await handleAgencyCreation(tx, agencyDetails);

      // Create emergency contacts
      const emergencyContactIds = [];
      const [contact1Id, contact2Id] = await all([
        createEmergencyContact(tx, emergencyContact1),
        createEmergencyContact(tx, emergencyContact2),
      ]);

      if (contact1Id) emergencyContactIds.push(contact1Id);
      if (contact2Id) emergencyContactIds.push(contact2Id);

      // Create main person
      const personAddressData = prepareAddressQueryData(pick(personDetails, addressFields), true);
      const personData = preparePersonQueryData(
        omit(personDetails, addressFields),
        null,
        organisationId,
        salaryAccountDetails,
        expenseAccountDetails,
        true,
      );

      if (!personData?.PersonFirstName) {
        throw new Error('PersonFirstName is required for main person');
      }

      const mainPerson = await createPersonWithAddress(tx, personData, personAddressData);

      // Create emergency contact relationships
      if (emergencyContactIds.length) {
        await tx.personPerson.createMany({
          data: emergencyContactIds.map((ContactId) => ({
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
