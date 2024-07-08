export const getProductionsConvertedPayload = (production) => {
  const {
    id,
    showId,
    prodCode,
    email,
    isArchived,
    image,
    frequency,
    company,
    region,
    rehearsalDateBlock,
    productionDateBlock,
    runningTime,
    runningTimeNote,
    currency,
  } = production;
  return {
    id,
    showId,
    code: prodCode,
    isArchived,
    image,
    company,
    runningTime,
    runningTimeNote,
    currency,
    salesEmail: email,
    salesFrequency: frequency,
    regionList: region.filter((o) => o !== 'select_all'),
    dateBlockList: [
      ...((rehearsalDateBlock?.StartDate &&
        rehearsalDateBlock?.EndDate && [
          {
            name: 'Rehearsal',
            startDate: rehearsalDateBlock?.StartDate,
            endDate: rehearsalDateBlock?.EndDate,
            isPrimary: false,
          },
        ]) ||
        []),
      {
        name: 'Production',
        startDate: productionDateBlock?.StartDate,
        endDate: productionDateBlock?.EndDate,
        isPrimary: true,
      },
    ].filter((x) => x),
  };
};
