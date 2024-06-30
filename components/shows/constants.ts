import { convertObjectKeysToCamelCase } from 'utils';

export const getProductionsConvertedPayload = (input, isEdit = false) => {
  const camelCaseData = input.DateBlock ? input.DateBlock.map((item) => convertObjectKeysToCamelCase(item)) : [];

  const output = {
    showId: input.ShowId,
    code: input.Code,
    salesEmail: input.SalesEmail,
    isArchived: input.IsArchived,
    satisfiesalesFrequency: input.SalesFrequency,
    regionList: input.RegionList.filter((o) => o !== 'select_all'),
    dateBlockList: camelCaseData,
    id: input.Id,
    image: input.Image,
  };

  if (!isEdit) delete output.id;

  if (isEdit) {
    if ('DateBlock[0].StartDate' in input) {
      output.dateBlockList[0].startDate = input['DateBlock[0].StartDate'];
    } else if ('DateBlock[0].EndDate' in input) {
      output.dateBlockList[0].endDate = input['DateBlock[0].EndDate'];
    } else if ('DateBlock[1].StartDate' in input) {
      output.dateBlockList[1].startDate = input['DateBlock[1].StartDate'];
    } else if ('DateBlock[1].EndDate' in input) {
      output.dateBlockList[1].endDate = input['DateBlock[1].EndDate'];
    }
  } else {
    if ('DateBlock[0].StartDate' in input) {
      output.dateBlockList.push({
        name: 'Rehearsal',
        startDate: input['DateBlock[0].StartDate'],
        endDate: input['DateBlock[0].EndDate'],
        isPrimary: false,
      });
    }

    if ('DateBlock[1].StartDate' in input) {
      output.dateBlockList.push({
        name: 'Production',
        startDate: input['DateBlock[1].StartDate'],
        endDate: input['DateBlock[1].EndDate'],
        isPrimary: true,
      });
    }
  }

  return output;
};
