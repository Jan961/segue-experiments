import axios from 'axios';
import { ConversionRateUpdate } from 'services/conversionRateService';

export const updateConversionRate = async (payload: { updates: ConversionRateUpdate[] }) => {
  return axios.put('/api/conversion-rate/update', payload);
};
