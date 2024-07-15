import axios from 'axios';
import { downloadFromContent } from 'components/bookings/modal/request';
import moment from 'moment';

type ProductionWeek = {
  Id: number;
  mondayDate: string;
  productionWeekNum: number;
};

export const fetchProductionWeek = async (productionId: number): Promise<ProductionWeek[]> => {
  const weeks: ProductionWeek[] = await axios
    .get(`/api/reports/productionWeek/${productionId}`)
    .then((data) => data.data);
  return weeks;
};

export const fetchProductionVenues = async (productionId: number): Promise<ProductionWeek[]> => {
  const venues = await axios.get(`/api/productions/read/venues/${productionId}`).then((data) => data.data);
  return venues;
};

export const exportSalesSummaryReport = async ({
  production,
  productionWeek,
  numberOfWeeks,
  isWeeklyReport = false,
  isSeatsDataRequired = false,
}) => {
  const toWeek = productionWeek?.split('T')?.[0];
  const fromWeek = moment(productionWeek)
    .subtract(numberOfWeeks - 1, 'weeks')
    .toISOString()
    ?.split('T')?.[0];
  const payload = {
    productionId: parseInt(production, 10),
    fromWeek,
    toWeek,
    isWeeklyReport,
    isSeatsDataRequired,
  };
  const response = await axios.post('/api/reports/sales-summary-simple', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Sales Summary';
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

export const exportPromoterHoldsReport = async ({ production, fromDate, toDate, venue, productionCode }: any) => {
  const payload = {
    productionId: parseInt(production, 10),
    productionCode,
    fromDate,
    toDate,
    venue,
  };

  const response = await axios.post('/api/reports/promoter-holds', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Sales Summary';
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
  return response;
};

export const exportProductionGrossSales = async ({ production }) => {
  const payload = {
    productionId: parseInt(production, 10),
  };
  const response = await axios.post('/api/reports/gross-sales', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Gross Sales';
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
  return response;
};

export const exportHoldsComps = async ({ production, productionCode, venue, fromDate, toDate, status }) => {
  const payload = {
    productionId: parseInt(production, 10),
    productionCode,
    venue,
    fromDate,
    toDate,
    status,
  };
  const response = await axios.post('/api/reports/holds-comps', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Holds Comps';
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
  return response;
};

export const exportSelectedVenues = async ({ production, productionCode, showId }) => {
  const payload = {
    productionId: parseInt(production, 10),
    productionCode,
    showId,
  };
  const response = await axios.post('/api/reports/venues', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Holds Comps';
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
