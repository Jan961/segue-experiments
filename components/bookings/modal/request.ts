import axios from 'axios';
import moment from 'moment';
import { getMonday } from 'services/dateService';

export const downloadFromContent = (content: Blob, filename: string) => {
  const url = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
};

export const onScheduleReport = async (ProductionId: number) => {
  try {
    const response = await axios.post('/api/reports/schedule-report', { ProductionId }, { responseType: 'blob' });

    if (response.status >= 200 && response.status < 300) {
      const productionName = `${ProductionId}`;
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
  } catch (error) {
    console.error(error);
  }
};

export const exportBookingSchedule = async (ProductionId: number) => {
  try {
    const response = await axios.post('/api/reports/booking-schedule', { ProductionId }, { responseType: 'blob' });

    if (response.status >= 200 && response.status < 300) {
      const productionName = `${ProductionId}`;
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
  } catch (error) {
    console.log(error);
  }
};

export const exportMasterplanReport = async (fromDate: string, toDate: string) => {
  try {
    const response = await axios.post(
      '/api/reports/masterplan',
      {
        fromDate: moment(getMonday(fromDate)).format('YYYY-MM-DD'),
        toDate: moment(new Date(toDate)).format('YYYY-MM-DD'),
      },
      { responseType: 'blob' },
    );

    if (response.status >= 200 && response.status < 300) {
      let suggestedName: string | null = null;

      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          suggestedName = match[1];
        }
      }

      if (!suggestedName) {
        suggestedName = 'Report.xlsx';
      }

      const content = response.data;
      if (content) {
        downloadFromContent(content, suggestedName);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const exportExcelReport = async (urlPath, payload = {}, fileName = 'Report.xlsx') => {
  try {
    const response = await axios.post(urlPath, payload, { responseType: 'blob' });

    if (response.status >= 200 && response.status < 300) {
      let suggestedName: string | null = null;

      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          suggestedName = match[1];
        }
      }

      if (!suggestedName) {
        suggestedName = fileName;
      }

      const content = response.data;
      if (content) {
        downloadFromContent(content, suggestedName);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
