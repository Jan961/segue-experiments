import axios from 'axios';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';

type BarringCheckPayload = {
  productionId: number;
  venueId: number;
  seats: number;
  barDistance: number;
  includeExcluded: boolean;
  startDate: string;
  endDate: string;
  filterBarredVenues: boolean;
};
export const fetchBarredVenues = async (body: BarringCheckPayload): Promise<BarredVenue[]> => {
  return axios.post('/api/productions/venue/barringCheck', body).then((response) => response.data);
};
