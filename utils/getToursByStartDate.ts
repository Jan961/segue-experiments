export const getToursByStartDate = (tours: any[]): any => {
  return [...tours].sort((a, b) => {
    return b.DateBlock[0].StartDate < a.DateBlock[0].StartDate ? 1 : -1;
  });
};
