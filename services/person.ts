import getPrismaClient from 'lib/prisma';
import { IOtherWorkType, IPersonDetails } from 'components/contracts/types';
import { prepareQuery } from 'utils/apiUtils';
import { Person, Prisma } from 'prisma/generated/prisma-client';
import { upsertAddress } from './address';
import { pick } from 'radash';
import { isNullOrEmpty } from 'utils';
import { NextApiRequest } from 'next';

export const addressFields = ['address1', 'address2', 'address3', 'postcode', 'town', 'country'];
export const organisationFields = ['name', 'website'];

export const preparePersonUpdateData = async (personDetails: Partial<IPersonDetails>) => {
  if (!personDetails) return null;
  const fieldMappings = [
    { key: 'firstName', updateKey: 'PersonFirstName' },
    { key: 'lastName', updateKey: 'PersonLastName' },
    { key: 'email', updateKey: 'PersonEmail' },
    { key: 'landline', updateKey: 'PersonPhone' },
    { key: 'mobileNumber', updateKey: 'PersonMobile' },
    { key: 'passportName', updateKey: 'PersonPassportName' },
    { key: 'passportExpiryDate', updateKey: 'PersonPassportExpiryDate', isDate: true },
    { key: 'hasUKWorkPermit', updateKey: 'PersonEligibleToWork' },
    { key: 'isFEURequired', updateKey: 'PersonFEURequired' },
    { key: 'notes', updateKey: 'PersonNotes' },
    { key: 'healthDetails', updateKey: 'PersonHealthNotes' },
    { key: 'advisoryNotes', updateKey: 'PersonAdvisoryNotes' },
    // { key: 'workType', updateKey: 'PersonPersonRole', isSetArray: true, arrayKey: 'PersonRoleId' },
    // { key: 'otherWorkTypes', updateKey: 'PersonOtherRole', isSetArray: true, arrayKey: 'PORName' },
    // foreign key connections
    { key: 'addressId', updateKey: 'PersonAddressId', foreignKeyId: 'AddressId', isForeignKey: true },
    { key: 'checkedBy', updateKey: 'PersonFEUCheckByAccUserId' },
  ];

  const personQuery = prepareQuery(personDetails, fieldMappings);

  return personQuery;
};

export const updatePerson = async (id: number, personDetails: any, tx) => {
  return tx.person.update({
    where: { PersonId: id },
    data: personDetails,
  });
};

const personInclude = Prisma.validator<Prisma.PersonInclude>()({
  Organisation_Person_PersonAgencyOrgIdToOrganisation: {
    include: {
      Person_Organisation_OrgContactPersonIdToPerson: {
        include: {
          Address: true,
        },
      },
    },
  },
  PersonPersonRole: true,
  PersonOtherRole: true,
  PersonPerson_PersonPerson_PPPersonIdToPerson: {
    include: {
      Person_PersonPerson_PPRolePersonIdToPerson: {
        include: {
          Address: true,
        },
      },
    },
  },
});

export type PersonWithRoles = Prisma.PersonGetPayload<{
  include: typeof personInclude;
}>;

export const getPersonById = async (id: number, req: NextApiRequest): Promise<PersonWithRoles> => {
  const prisma = await getPrismaClient(req);
  return prisma.person.findUnique({
    where: { PersonId: Number(id) },
    include: {
      Address: true,
      Organisation_Person_PersonAgencyOrgIdToOrganisation: {
        include: {
          Person_Organisation_OrgContactPersonIdToPerson: {
            include: {
              Address: true,
            },
          },
        },
      },
      PersonPersonRole: {
        include: {
          PersonRole: true,
        },
      },
      PersonOtherRole: true,
      PersonPerson_PersonPerson_PPPersonIdToPerson: {
        include: {
          Person_PersonPerson_PPRolePersonIdToPerson: {
            include: {
              Address: true,
            },
          },
        },
      },
    },
  });
};

export const upsertPerson = async (personDetails, salaryAccountDetails, expenseAccountDetails, tx) => {
  const { id, addressId, firstName, lastName, email, mobileNumber, landline, otherWorkTypes, workType } = personDetails;

  const addressDetails = pick(personDetails, addressFields);
  const updatedAddress = await upsertAddress(addressId, addressDetails, tx);
  const personData: Partial<Person> = {
    PersonFirstName: firstName,
    PersonLastName: lastName,
    PersonEmail: email,
    PersonMobile: mobileNumber,
    PersonPhone: landline,
    PersonAddressId: updatedAddress.AddressId,
    PersonLastModified: new Date(),
  };

  // Handle salary account details
  if (salaryAccountDetails) {
    personData.PersonPaymentTo = salaryAccountDetails.paidTo;
    personData.PersonPaymentAccountName = salaryAccountDetails.accountName;
    personData.PersonPaymentAccount = salaryAccountDetails.accountNumber;
    personData.PersonPaymentSortCode = salaryAccountDetails.sortCode;
    personData.PersonPaymentSWIFTBIC = salaryAccountDetails.swift;
    personData.PersonPaymentIBAN = salaryAccountDetails.iban;
    personData.PersonPaymentBankCountryId = salaryAccountDetails.country;
  }

  // Handle expense account details
  if (expenseAccountDetails) {
    personData.PersonExpensesTo = expenseAccountDetails.paidTo;
    personData.PersonExpensesAccountName = expenseAccountDetails.accountName;
    personData.PersonExpensesAccount = expenseAccountDetails.accountNumber;
    personData.PersonExpensesSortCode = expenseAccountDetails.sortCode;
    personData.PersonExpensesSWIFTBIC = expenseAccountDetails.swift;
    personData.PersonExpensesIBAN = expenseAccountDetails.iban;
    personData.PersonExpensesBankCountryId = expenseAccountDetails.country;
  }

  // Update or create a person record
  const person = await tx.person.upsert({
    where: { PersonId: id },
    update: personData,
    create: personData,
  });

  // Handle workTypes and otherWorkTypes associations
  await updatePersonRoles(person.PersonId, workType, otherWorkTypes, tx);

  return person;
};

export const updatePersonRoles = async (
  personId: number,
  workTypes: number[],
  otherWorkTypes: IOtherWorkType[],
  tx,
) => {
  // Update PersonPersonRole
  if (workTypes) {
    await tx.personPersonRole.deleteMany({ where: { PPRPersonId: personId } });
    for (const roleId of workTypes) {
      await tx.personPersonRole.create({
        data: {
          PPRPersonId: personId,
          PPRPersonRoleId: roleId,
        },
      });
    }
  }

  // Update PersonOtherRole
  if (otherWorkTypes) {
    await tx.personOtherRole.deleteMany({ where: { PORPersonId: personId } });
    for (const otherRole of otherWorkTypes) {
      await tx.personOtherRole.create({
        data: {
          PORPersonId: personId,
          PORName: otherRole.name,
        },
      });
    }
  }
};

export const handleEmergencyContacts = async (personId: number, emergencyContact1, emergencyContact2, tx) => {
  if (!isNullOrEmpty(emergencyContact1)) {
    await upsertEmergencyContact(personId, emergencyContact1, 'emergencycontact', tx);
  }
  if (!isNullOrEmpty(emergencyContact2)) {
    await upsertEmergencyContact(personId, emergencyContact2, 'emergencycontact', tx);
  }
};

export const upsertEmergencyContact = async (
  personId: number,
  contactDetails,
  role = 'emergencycontact',
  tx,
  existingPPId?: number,
) => {
  // Early return if no firstName (required field)
  if (!contactDetails.firstName) return null;

  const {
    id,
    addressId,
    firstName,
    lastName,
    email,
    mobileNumber,
    landline,
    address1,
    address2,
    address3,
    town,
    postcode,
    country,
  } = contactDetails;

  // Only proceed with address if any address field has a value
  const hasAddressData = [address1, address2, address3, town, postcode, country].some(
    (field) => field !== null && field !== undefined && field !== '',
  );

  let addressResult = null;
  if (hasAddressData) {
    addressResult = await upsertAddress(addressId, { address1, address2, address3, town, postcode, country }, tx);
  }

  const contactData = {
    PersonFirstName: firstName, // Required field
    PersonLastName: lastName || '', // Provide empty string for nullable fields
    PersonEmail: email || null,
    PersonMobile: mobileNumber || null,
    PersonPhone: landline || null,
    ...(addressResult && { PersonAddressId: addressResult.AddressId }),
  };

  const existingPersonPerson = id
    ? await tx.personPerson.findUnique({
        where: { PPId: id },
        select: { PPRolePersonId: true },
      })
    : null;

  const personIdToUse = existingPersonPerson?.PPRolePersonId || 0;

  // Upsert emergency contact person
  const emergencyContact = await tx.person.upsert({
    where: { PersonId: personIdToUse },
    update: contactData,
    create: contactData,
  });

  // Use the provided PPId or the existing one from the ordered list
  const ppIdToUse = id || existingPPId || 0;

  // Link this person to the main person via PersonPerson
  await tx.personPerson.upsert({
    where: {
      PPId: ppIdToUse,
    },
    create: {
      PPPersonId: personId,
      PPRolePersonId: emergencyContact.PersonId,
      PPRoleType: role,
    },
    update: {
      PPPersonId: personId,
      PPRolePersonId: emergencyContact.PersonId,
      PPRoleType: role,
    },
  });

  return emergencyContact;
};

export const handleAgencyDetails = async (personId: number, agencyDetails: any, tx) => {
  if (!agencyDetails || !agencyDetails.hasAgent) {
    // Handle removal of agency relationship
    await removeAgencyRelationships(personId, tx);
    return;
  }

  // Early return if required fields are missing
  if (!agencyDetails.firstName || !agencyDetails.name) return;

  const { agencyPersonId = 0, website, name } = agencyDetails;

  // Handle the agency contact person
  const agencyContactData: Partial<Person> = {
    PersonFirstName: agencyDetails.firstName,
    PersonLastName: agencyDetails.lastName || '',
    PersonEmail: agencyDetails.email || null,
    PersonPhone: agencyDetails.landline || null,
    PersonMobile: agencyDetails.mobileNumber || null,
  };

  // Create or update address if address fields are present
  let addressId = null;
  const hasAddressData = [
    agencyDetails.address1,
    agencyDetails.address2,
    agencyDetails.address3,
    agencyDetails.town,
    agencyDetails.postcode,
    agencyDetails.country,
  ].some((field) => field !== null && field !== undefined && field !== '');

  if (hasAddressData) {
    const address = await upsertAddress(agencyDetails.addressId || 0, agencyDetails, tx);
    addressId = address.AddressId;
  }

  if (addressId) {
    agencyContactData.PersonAddressId = addressId;
  }

  // Create or update the agency contact person
  const agencyContact = await tx.person.upsert({
    where: { PersonId: agencyPersonId || 0 },
    update: agencyContactData,
    create: agencyContactData,
  });

  // Create or update organisation first
  const organisation = await tx.organisation.upsert({
    where: {
      OrgId: agencyDetails.id || 0,
    },
    create: {
      OrgName: name,
      OrgWebsite: website || null,
      OrgContactPersonId: agencyContact.PersonId,
    },
    update: {
      OrgName: name,
      OrgWebsite: website || null,
      OrgContactPersonId: agencyContact.PersonId,
    },
  });

  // Then update the person with the new organisation ID
  await tx.person.update({
    where: { PersonId: personId },
    data: {
      PersonAgencyOrgId: organisation.OrgId,
    },
  });

  return {
    agencyContact,
    organisation,
  };
};

// Updated helper function to remove agency relationships
const removeAgencyRelationships = async (personId: number, tx) => {
  try {
    // First get the current person with their agency relationship
    const person = await tx.person.findUnique({
      where: { PersonId: personId },
      select: {
        PersonAgencyOrgId: true,
        Organisation_Person_PersonAgencyOrgIdToOrganisation: {
          select: {
            OrgId: true,
            Person_Person_PersonAgencyOrgIdToOrganisation: {
              select: {
                PersonId: true,
              },
            },
          },
        },
      },
    });

    if (!person?.PersonAgencyOrgId) return;

    // First remove the agency link from the person
    await tx.person.update({
      where: { PersonId: personId },
      data: {
        PersonAgencyOrgId: null,
      },
    });

    const org = person.Organisation_Person_PersonAgencyOrgIdToOrganisation;

    if (org) {
      // Check if this was the only person linked to this organization
      const linkedPersons = org.Person_Person_PersonAgencyOrgIdToOrganisation;

      if (linkedPersons.length <= 1) {
        // If this was the only link, we can safely delete the organization
        await tx.organisation.delete({
          where: {
            OrgId: org.OrgId,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error removing agency relationships:', error);
    throw error;
  }
};
