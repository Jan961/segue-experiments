export const generateProductionTaskId = (productionCode: string, lastUsedId: string) => {
  const lastIdNumber = parseInt(lastUsedId.split('-')[1], 10);
  const newIdNumber = lastIdNumber + 1;
  const newId = newIdNumber.toString().padStart(3, '0');
  return `${productionCode}-${newId}`;
};
