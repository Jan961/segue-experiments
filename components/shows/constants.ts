export const SALES_FIG_OPTIONS = [
  {
    value: 'D',
    text: 'Daily',
  },
  {
    value: 'W',
    text: 'Weekly',
  },
];

export const REGIONS_LIST = [
  {
    value: '8',
    text: 'UK, Ire, Channel Islands, IOM',
  },
  {
    value: '4',
    text: 'Mainland Europe',
  },
  {
    value: '6',
    text: 'Scandinavia',
  },
  {
    value: 'middleEast',
    text: 'Middle East',
  },
  {
    value: '2',
    text: 'Asia',
  },
  {
    value: '3',
    text: 'Aus, NZ, S Pacific',
  },
  {
    value: '1',
    text: 'Africa',
  },
  {
    value: '5',
    text: 'North America',
  },
  {
    value: '7',
    text: 'South America',
  },
];

export const getConvertedPayload = (input) => {
  const output = {
    ShowId: input.ShowId,
    Code: input.Code,
    SalesEmail: input.SalesEmail,
    IsArchived: input.IsArchived,
    SalesFrequency: input.SalesFrequency,
    RegionId: input.RegionId,
    DateBlock: [],
  };

  if ('DateBlock[0].StartDate' in input) {
    output.DateBlock.push({
      Name: 'Rehearsal',
      StartDate: input['DateBlock[0].StartDate'],
      EndDate: input['DateBlock[0].EndDate'],
      IsPrimary: true,
    });
  }

  if ('DateBlock[1].StartDate' in input) {
    output.DateBlock.push({
      Name: 'Production',
      StartDate: input['DateBlock[1].StartDate'],
      EndDate: input['DateBlock[1].EndDate'],
      IsPrimary: false,
    });
  }

  return output;
};
