import axios from 'axios';
import { downloadFromContent } from 'components/bookings/modal/request';
import { sub } from 'date-fns';
import { getDateObject } from 'services/dateService';

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
  format = 'excel',
}) => {
  const toWeek = productionWeek?.split('T')?.[0];
  const fromWeek = sub(getDateObject(toWeek), { weeks: numberOfWeeks })?.toISOString?.()?.split('T')?.[0];
  const payload = {
    productionId: parseInt(production, 10),
    exportedAt: new Date().toISOString(),
    fromWeek,
    toWeek,
    isWeeklyReport,
    isSeatsDataRequired,
    format,
  };
  const response = await axios.post('/api/reports/sales-summary-simple', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Sales Summary';
    let suggestedName: string | null = null;

    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.[1]) {
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

export const exportPromoterHoldsReport = async ({
  production,
  fromDate,
  toDate,
  venue,
  productionCode,
  format,
}: any) => {
  const payload = {
    productionId: parseInt(production, 10),
    exportedAt: new Date().toISOString(),
    productionCode,
    fromDate,
    toDate,
    venue,
    format,
  };

  const response = await axios.post('/api/reports/promoter-holds', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Sales Summary';
    let suggestedName: string | null = null;

    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.[1]) {
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

export const exportProductionGrossSales = async ({ production, format }) => {
  const payload = {
    productionId: parseInt(production, 10),
    format,
    exportedAt: new Date().toISOString(),
  };
  const response = await axios.post('/api/reports/gross-sales', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Gross Sales';
    let suggestedName: string | null = null;

    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.[1]) {
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

export const exportHoldsComps = async ({ production, productionCode, venue, fromDate, toDate, status, format }) => {
  const payload = {
    productionId: parseInt(production, 10),
    exportedAt: new Date().toISOString(),
    productionCode,
    venue,
    fromDate,
    toDate,
    status,
    format,
  };
  const response = await axios.post('/api/reports/holds-comps', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Holds Comps';
    let suggestedName: string | null = null;

    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.[1]) {
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

export const exportSelectedVenues = async ({ production, productionCode, showId, selection, format }) => {
  const payload = {
    productionId: parseInt(production, 10),
    productionCode,
    showId,
    selection,
    format,
  };
  const response = await axios.post('/api/reports/venues', payload, { responseType: 'blob' });

  if (response.status >= 200 && response.status < 300) {
    const productionName = 'Holds Comps';
    let suggestedName: string | null = null;

    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.[1]) {
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
