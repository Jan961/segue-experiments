import prisma from 'lib/prisma';
import { IPersonDetails } from 'components/contracts/types';
import { prepareUpdateData } from 'utils/apiUtils';

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
    { key: 'workType', updateKey: 'PersonPersonRole', isSetArray: true, arrayKey: 'PersonRoleId' },
    { key: 'otherWorkTypes', updateKey: 'PersonOtherRole', isSetArray: true, arrayKey: 'PORName' },
    // foreign key connections
    { key: 'addressId', updateKey: 'PersonAddressId', foreignKeyId: 'AddressId', isForeignKey: true },
    { key: 'checkedBy', updateKey: 'PersonFEUCheckByUserId', foreignKeyId: 'Id', isForeignKey: true },
  ];

  return prepareUpdateData(personDetails, fieldMappings);
};

export const updatePerson = async (id: number, personDetails: any, tx = prisma) => {
  return tx.person.update({
    where: { PersonId: id },
    data: personDetails,
  });
};
