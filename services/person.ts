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

export const upsertEmergencyContact = async (personId: number, contactDetails, role = 'emergencycontact', tx) => {
  const { id, addressId, firstName, lastName, email, mobileNumber, landline } = contactDetails;
  const address = await upsertAddress(addressId, pick(contactDetails, addressFields), tx);
  const contactData = {
    PersonFirstName: firstName,
    PersonLastName: lastName,
    PersonEmail: email,
    PersonMobile: mobileNumber,
    PersonPhone: landline,
    PersonAddressId: address.AddressId,
  };

  // Upsert emergency contact person
  const emergencyContact = await tx.person.upsert({
    where: { PersonId: contactDetails?.personId || 0 },
    update: contactData,
    create: contactData,
  });

  // Link this person to the main person via PersonPerson with role "emergencycontact"
  await tx.personPerson.upsert({
    where: {
      PPId: id || 0,
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
};

export const handleAgencyDetails = async (personId: number, agencyDetails, tx) => {
  if (!agencyDetails) return;

  const agencyPersonId = agencyDetails.agencyPersonId || 0;

  // Create or update agency person
  const agencyPerson = await tx.person.upsert({
    where: { PersonId: agencyPersonId || 0 },
    update: {
      PersonFirstName: agencyDetails.firstName,
      PersonLastName: agencyDetails.lastName,
      PersonEmail: agencyDetails.email,
      PersonPhone: agencyDetails.landline,
      PersonMobile: agencyDetails.mobileNumber,
    },
    create: {
      PersonFirstName: agencyDetails.firstName,
      PersonLastName: agencyDetails.lastName,
      PersonEmail: agencyDetails.email,
      PersonPhone: agencyDetails.landline,
      PersonMobile: agencyDetails.mobileNumber,
    },
  });

  // Create or update the address for the agency person
  if (agencyDetails.addressId) {
    await upsertAddress(agencyDetails.addressId, agencyDetails, tx);
  }

  // Link this person to the main person in the Organisation via the `Person_Organisation_OrgContactPersonIdToPerson` table
  await tx.person.update({
    where: { PersonId: personId },
    data: {
      PersonAgencyOrgId: agencyPerson.PersonId, // Link agency person to main person
    },
  });
};
