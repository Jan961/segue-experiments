import { PersonMinimalDTO } from 'interfaces';
import getPrismaClient from 'lib/prisma';
import { Person } from 'prisma/generated/prisma-client';
import { isNullOrEmpty, isUndefined } from 'utils';
import { FieldMapping, prepareQuery } from 'utils/apiUtils';
import { prepareAccountUpdateData } from './contracts';
import { BankAccount, IPersonDetails } from 'components/contracts/types';
import { NextApiRequest } from 'next';

interface AddressDetails {
  address1?: string;
  address2?: string;
  address3?: string;
  town?: string;
  postcode?: string;
  country?: number | null;
}

export const prepareAddressQueryData = (addressDetails: AddressDetails | null, isCreate = false) => {
  if (isNullOrEmpty(addressDetails)) return null;

  const fieldMappings: FieldMapping[] = [
    { key: 'address1', updateKey: 'Address1' },
    { key: 'address2', updateKey: 'Address2' },
    { key: 'address3', updateKey: 'Address3' },
    { key: 'town', updateKey: 'AddressTown' },
    { key: 'postcode', updateKey: 'AddressPostcode' },
    { key: 'country', updateKey: 'Country', isForeignKey: true, foreignKeyId: 'Id' },
  ];

  return prepareQuery(addressDetails, fieldMappings, isCreate);
};

interface OrganisationDetails {
  name?: string;
  website?: string;
}

export const prepareOrganisationQueryData = (
  orgDetails: OrganisationDetails | null,
  contactPersonId?: number | null,
  isCreate = false,
) => {
  if (isNullOrEmpty(orgDetails)) return null;

  const fieldMappings: FieldMapping[] = [
    { key: 'name', updateKey: 'OrgName' },
    { key: 'website', updateKey: 'OrgWebsite' },
    {
      key: 'contactPersonId',
      updateKey: 'Person_Organisation_OrgContactPersonIdToPerson',
      isForeignKey: true,
      foreignKeyId: 'PersonId',
    },
  ];

  const detailsWithContactPerson = {
    ...orgDetails,
    contactPersonId,
  };

  return prepareQuery(detailsWithContactPerson, fieldMappings, isCreate);
};

interface PersonPersonDetails {
  mainPersonId?: number;
  relatedPersonId?: number;
  roleName?: string;
}

export const preparePersonPersonQueryData = (personPersonDetails: PersonPersonDetails, isCreate = false) => {
  if (
    isUndefined(personPersonDetails.mainPersonId) ||
    isUndefined(personPersonDetails.relatedPersonId) ||
    isUndefined(personPersonDetails.roleName)
  ) {
    return null;
  }

  const fieldMappings: FieldMapping[] = [
    { key: 'mainPersonId', updateKey: 'PPPersonId' },
    { key: 'relatedPersonId', updateKey: 'PPPersonRoleId' },
    { key: 'roleName', updateKey: 'PersonRoleType' },
  ];

  return prepareQuery(personPersonDetails, fieldMappings, isCreate);
};

export const preparePersonQueryData = (
  personDetails: Partial<IPersonDetails>,
  addressId?: number | null,
  organisationId?: number | null,
  salaryAccountDetails?: Partial<BankAccount>,
  expenseAccountDetails?: Partial<BankAccount>,
  isCreate = false,
) => {
  if (isNullOrEmpty(personDetails)) return null;

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

  let personData = prepareQuery({ ...personDetails, addressId, organisationId }, personFieldMappings, isCreate);

  if (personDetails.workType && personDetails.workType.length > 0) {
    personData.PersonPersonRole = {
      create: personDetails.workType.map((workTypeId) => ({
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

export const fetchAllMinPersonsList = async (req: NextApiRequest): Promise<PersonMinimalDTO[]> => {
  const prisma = await getPrismaClient(req);
  const persons: Partial<Person>[] = await prisma.person.findMany({
    select: {
      PersonId: true,
      PersonFirstName: true,
      PersonLastName: true,
      PersonEmail: true,
    },
    orderBy: {
      PersonFirstName: 'asc',
    },
  });
  return persons.map((person) => ({
    id: person.PersonId ?? null,
    firstName: person.PersonFirstName ?? '',
    lastName: person.PersonLastName ?? '',
    email: person.PersonEmail ?? '',
  }));
};
