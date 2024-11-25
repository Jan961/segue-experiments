import { newDate } from 'services/dateService';

export const sortByProductionStartDate = (data: any) => {
  return data.sort((a, b) => {
    const productionA = a.DateBlock.find((block) => block.Name === 'Production');
    const productionB = b.DateBlock.find((block) => block.Name === 'Production');
    if (!productionA || !productionB) {
      return productionA ? -1 : 1;
    }
    return newDate(productionA.StartDate).getTime() - newDate(productionB.StartDate).getTime();
  });
};
