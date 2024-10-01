export type ConversionRateUpdate = {
  id?: number;
  fromCurrencyCode?: string;
  toCurrencyCode?: string;
  productionId?: number;
  rate: number;
};

export const updateConversionRateById = async (tx, { id, rate }: ConversionRateUpdate) => {
  return tx.conversionRate.update({
    where: { Id: id },
    data: { Rate: rate },
  });
};

export const updateConversionRateByDetails = async (
  tx,
  { fromCurrencyCode, toCurrencyCode, productionId, rate }: ConversionRateUpdate,
) => {
  return tx.conversionRate.updateMany({
    where: {
      FromCurrencyCode: fromCurrencyCode,
      ToCurrencyCode: toCurrencyCode,
      ProductionId: productionId,
    },
    data: { Rate: rate },
  });
};
