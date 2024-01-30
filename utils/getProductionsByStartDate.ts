export const getProductionsByStartDate = (productions: any[]): any => {
  return [...productions].sort((a, b) => {
    return b.DateBlock[0].StartDate < a.DateBlock[0].StartDate ? 1 : -1;
  });
};
