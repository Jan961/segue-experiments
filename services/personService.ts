import { PersonMinimalDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { Person } from 'prisma/generated/prisma-client';
import { isUndefined } from 'utils';
import { FieldMapping, prepareUpdateData } from 'utils/apiUtils';
import { prepareAccountUpdateData } from './contracts';

interface AddressDetails {
  address1?: string;
  address2?: string;
  address3?: string;
  town?: string;
  postcode?: string;
  country?: number | null;
}

export const prepareAddressQueryData = (addressDetails: AddressDetails | null) => {
  if (!addressDetails) return null;

  const fieldMappings: FieldMapping[] = [
    { key: 'address1', updateKey: 'Address1' },
    { key: 'address2', updateKey: 'Address2' },
    { key: 'address3', updateKey: 'Address3' },
    { key: 'town', updateKey: 'AddressTown' },
    { key: 'postcode', updateKey: 'AddressPostcode' },
    { key: 'country', updateKey: 'Country', isForeignKey: true, foreignKeyId: 'Id' },
  ];

  return prepareUpdateData(addressDetails, fieldMappings);
};

interface OrganisationDetails {
  name?: string;
  website?: string;
}

export const prepareOrganisationQueryData = (
  orgDetails: OrganisationDetails | null,
  contactPersonId?: number | null,
) => {
  if (!orgDetails) return null;

  const { name, website } = orgDetails;

  const organisationData: any = {};

  if (!isUndefined(name)) {
    organisationData.OrgName = name;
  }

  if (!isUndefined(website)) {
    organisationData.OrgWebsite = website;
  }

  if (!isUndefined(contactPersonId)) {
    if (contactPersonId === null) {
      organisationData.OrgContactPersonId = {
        disconnect: true,
      };
    } else {
      organisationData.OrgContactPersonId = {
        connect: { PersonId: contactPersonId },
      };
    }
  }

  return organisationData;
};

interface PersonPersonDetails {
  mainPersonId?: number;
  relatedPersonId?: number;
  roleName?: string;
}

export const preparePersonPersonQueryData = ({ mainPersonId, relatedPersonId, roleName }: PersonPersonDetails) => {
  if (isUndefined(mainPersonId) || isUndefined(relatedPersonId) || isUndefined(roleName)) {
    return null;
  }

  const personPersonData: any = {};

  if (!isUndefined(mainPersonId)) {
    personPersonData.PPPersonId = mainPersonId;
  }

  if (!isUndefined(relatedPersonId)) {
    personPersonData.PPPersonRoleId = relatedPersonId;
  }

  if (!isUndefined(roleName)) {
    personPersonData.PersonRoleType = roleName;
  }

  return personPersonData;
};

interface AccountDetails {
  paidTo?: string;
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  swift?: string;
  iban?: string;
  country?: number | null;
}

interface PersonDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  landline?: string;
  mobileNumber?: string;
  passportName?: string;
  passportExpiryDate?: string | null;
  hasUKWorkPermit?: number;
  isFEURequired?: number;
  notes?: string;
  healthDetails?: string;
  advisoryNotes?: string;
  workTypes?: number[];
  otherWorkTypes?: string[];
}

export const preparePersonQueryData = (
  personDetails: PersonDetails,
  addressId?: number | null,
  organisationId?: number | null,
  salaryAccountDetails?: AccountDetails,
  expenseAccountDetails?: AccountDetails,
) => {
  if (!personDetails) return null;

  const personFieldMappings: FieldMapping[] = [
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
    { key: 'addressId', updateKey: 'Address', isForeignKey: true, foreignKeyId: 'AddressId' },
    {
      key: 'organisationId',
      updateKey: 'Organisation_Person_PersonAgencyOrgIdToOrganisation',
      isForeignKey: true,
      foreignKeyId: 'OrgId',
    },
  ];

  let personData = prepareUpdateData({ ...personDetails, addressId, organisationId }, personFieldMappings);

  if (personDetails.workTypes && personDetails.workTypes.length > 0) {
    personData.PersonPersonRole = {
      create: personDetails.workTypes.map((workTypeId) => ({
        PersonRole: {
          connect: {
            PersonRoleId: workTypeId,
          },
        },
      })),
    };
  }

  if (personDetails.otherWorkTypes && personDetails.otherWorkTypes.length > 0) {
    personData.PersonOtherRole = {
      create: personDetails.otherWorkTypes.map((roleName) => ({
        PORName: roleName,
      })),
    };
  }

  // Handle salaryAccountDetails
  if (salaryAccountDetails) {
    const salaryAccountData = prepareAccountUpdateData(salaryAccountDetails, true);
    if (salaryAccountData) {
      personData = { ...personData, ...salaryAccountData };
    }
  }

  // Handle expenseAccountDetails
  if (expenseAccountDetails) {
    const expensesAccountData = prepareAccountUpdateData(salaryAccountDetails, false);
    if (expensesAccountData) {
      personData = { ...personData, ...expensesAccountData };
    }
  }

  return personData;
};

export const fetchAllMinPersonsList = async (): Promise<PersonMinimalDTO[]> => {
  const persons: Person[] = await prisma.Person.findMany({
    select: {
      PersonId: true,
      PersonFirstName: true,
      PersonLastName: true,
      PersonEmail: true,
    },
  });
  return persons.map((person) => ({
    id: person.PersonId ?? null,
    firstName: person.PersonFirstName ?? '',
    lastName: person.PersonLastName ?? '',
    email: person.PersonEmail ?? '',
  }));
};
