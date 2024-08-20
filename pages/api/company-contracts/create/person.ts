import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import * as yup from 'yup';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { isUndefined } from 'utils';
import { omit, pick } from 'radash';
import { preparePersonQueryData } from 'services/personService';

// Yup schema for validation (expand as needed)
const personSchema = yup.object().shape({
  personDetails: yup.object().required(),
  agencyDetails: yup.object().nullable(),
  emergencyContact1: yup.object().nullable(),
  emergencyContact2: yup.object().nullable(),
});

export const prepareOrganisationQueryData = (orgDetails, contactPersonId) => {
  if (!orgDetails) return null;

  const organisationData: any = {};

  if (!isUndefined(orgDetails.name)) {
    organisationData.OrgName = orgDetails.name;
  }

  if (!isUndefined(orgDetails.website)) {
    organisationData.OrgWebsite = orgDetails.website;
  }

  if (!isUndefined(contactPersonId)) {
    if (contactPersonId === null) {
      organisationData.OrgContactPersonId = {
        disconnect: true,
      };
    } else {
      organisationData.Person_Organisation_OrgContactPersonIdToPerson = {
        connect: { PersonId: contactPersonId },
      };
    }
  }

  return organisationData;
};

export const prepareAddressQueryData = (addressDetails) => {
  if (!addressDetails) return null;

  const addressData: any = {};

  if (!isUndefined(addressDetails.address1)) {
    addressData.Address1 = addressDetails.address1;
  }
  if (!isUndefined(addressDetails.address2)) {
    addressData.Address2 = addressDetails.address2;
  }
  if (!isUndefined(addressDetails.address3)) {
    addressData.Address3 = addressDetails.address3;
  }
  if (!isUndefined(addressDetails.town)) {
    addressData.AddressTown = addressDetails.town;
  }
  if (!isUndefined(addressDetails.postcode)) {
    addressData.AddressPostcode = addressDetails.postcode;
  }
  if (!isUndefined(addressDetails.country)) {
    if (addressDetails.country === null) {
      addressData.Country = {
        disconnect: true,
      };
    } else {
      addressData.Country = {
        connect: { Id: addressDetails.country },
      };
    }
  }

  return addressData;
};

const addressFields = ['address1', 'address2', 'address3', 'postcode', 'town'];
const organisationFields = ['name', 'website'];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    // Validate the incoming payload
    const validatedData = await personSchema.validate(req.body, { abortEarly: false });

    const {
      personDetails,
      agencyDetails,
      emergencyContact1,
      emergencyContact2,
      salaryAccountDetails,
      expenseAccountDetails,
    } = validatedData;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the agency person and organization (if provided)
      let agencyPersonId = null;
      let organisationId = null;
      if (agencyDetails) {
        const agencyPersonAddressData = prepareAddressQueryData(pick(agencyDetails, addressFields));
        const agencyPersonData = preparePersonQueryData(omit(agencyDetails, [...addressFields, ...organisationFields]));
        const agencyPerson = await tx.person.create({
          data: {
            ...agencyPersonData,
            Address: {
              create: {
                ...agencyPersonAddressData,
              },
            },
          },
        });
        agencyPersonId = agencyPerson.PersonId;
        const organisationData = prepareOrganisationQueryData(pick(agencyDetails, organisationFields), agencyPersonId);
        const organisation = await tx.organisation.create({
          data: organisationData,
        });
        organisationId = organisation.OrgId;
      }

      // 2. Create emergency contacts (if provided)
      const emergencyContactList = [];
      if (emergencyContact1) {
        const emergencyContactAddressData = prepareAddressQueryData(pick(emergencyContact1, addressFields));
        const emergencyContactData = preparePersonQueryData(omit(emergencyContact1, addressFields));
        const emergencyContact1Person = await tx.person.create({
          data: {
            ...emergencyContactData,
            Address: {
              create: emergencyContactAddressData,
            },
          },
        });
        emergencyContactList.push(emergencyContact1Person.PersonId);
      }

      if (emergencyContact2) {
        const emergencyContactAddressData = prepareAddressQueryData(pick(emergencyContact1, addressFields));
        const emergencyContactData = preparePersonQueryData(omit(emergencyContact1, addressFields));
        const emergencyContact2Person = await tx.person.create({
          data: {
            ...emergencyContactData,
            Address: {
              create: emergencyContactAddressData,
            },
          },
        });
        emergencyContactList.push(emergencyContact2Person.PersonId);
      }

      // 3. Create the main person with all foreign keys connected
      const personAddressData = prepareAddressQueryData(pick(personDetails, addressFields));
      const personData = preparePersonQueryData(
        omit(personDetails, addressFields),
        null,
        organisationId,
        salaryAccountDetails,
        expenseAccountDetails,
      );
      const mainPerson = await tx.person.create({
        data: {
          ...personData,
          Address: {
            create: personAddressData,
          },
        },
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
