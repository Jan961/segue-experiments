export const getStaticDetailsTags = () => {
  return {
    FIRSTPERFORMANCEDATE: getFirstPerfDate(),
    DATEOFDOCCREATION: getDateOfDocumentCreation(),
    NUMPERFORMANCESPERWEEK: getNumPerformancesPerWeek(),
  };
};

const getFirstPerfDate = () => {
  return new Date('01/01/2010').toISOString();
};

const getDateOfDocumentCreation = () => {
  return new Date().toISOString();
};

const getNumPerformancesPerWeek = () => {
  return 3;
};
