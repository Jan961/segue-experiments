import prisma from 'lib/prisma';
import { IPersonDetails } from 'components/contracts/types';
import { prepareQuery } from 'utils/apiUtils';
import { Prisma } from 'prisma/generated/prisma-client';

export const preparePersonUpdateData = (personDetails: Partial<IPersonDetails>) => {
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
    { key: 'checkedBy', updateKey: 'AccountUser', foreignKeyId: 'Id', isForeignKey: true },
  ];

  return prepareQuery(personDetails, fieldMappings);
};

export const updatePerson = async (id: number, personDetails: any, tx = prisma) => {
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

export const getPersonById = async (id: number): Promise<PersonWithRoles> => {
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
