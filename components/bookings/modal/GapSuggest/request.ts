import axios from 'axios';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';
import { downloadFromContent } from '../request';
import { GapSuggestionUnbalancedProps } from 'services/booking/gapSuggestion/types';

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

export const exportGapSuggestions = async (
  payload: Partial<GapSuggestionUnbalancedProps>,
  filteredVenueIds: number[],
) => {
  const response = await axios.post(
    '/api/reports/booking/gap-suggestion',
    { ...payload, filteredVenueIds },
    { responseType: 'blob' },
  );

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Venue Suggestions';
    let suggestedName: string | null = null;

    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        suggestedName = match[1];
      }
    }

    if (!suggestedName) {
      suggestedName = `${productionName}.xlsx`;
    }

    const content = response.data;
    if (content) {
      downloadFromContent(content, suggestedName);
    }
  }
};
