import axios, { AxiosResponseHeaders } from 'axios';
import moment from 'moment';
import { getMonday, getTimezonOffset } from 'services/dateService';
import { FilterState } from 'state/booking/filterState';

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

const getFileNameFromHeaders = (headers: AxiosResponseHeaders, defaultName: string, extension = 'xlsx') => {
  let suggestedName: string | null = null;

  const contentDisposition = headers['content-disposition'];
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match && match[1]) {
      suggestedName = match[1];
    }
  }

  if (!suggestedName) {
    suggestedName = `${defaultName}.${extension}`;
  }
  return suggestedName;
};

export const onScheduleReport = async (ProductionId: number, filters: Partial<FilterState> = {}) => {
  try {
    const response = await axios.post(
      '/api/reports/schedule-report',
      { ProductionId, ...filters },
      { responseType: 'blob' },
    );

    if (response.status >= 200 && response.status < 300) {
      const defaultName = `${ProductionId}`;
      const suggestedName = getFileNameFromHeaders(response.headers as AxiosResponseHeaders, defaultName, 'xlsx');
      const content = response.data;
      if (content) {
        downloadFromContent(content, suggestedName);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const exportBookingSchedule = async (ProductionId: number, filters: Partial<FilterState> = {}) => {
  try {
    const response = await axios.post(
      '/api/reports/booking-schedule',
      { ProductionId, ...filters },
      { responseType: 'blob' },
    );

    if (response.status >= 200 && response.status < 300) {
      const defaultName = `${ProductionId}`;
      const suggestedName = getFileNameFromHeaders(response.headers as AxiosResponseHeaders, defaultName, 'xlsx');
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
        timezoneOffset: getTimezonOffset(),
      },
      { responseType: 'blob' },
    );

    if (response.status >= 200 && response.status < 300) {
      const defaultName = `Report`;
      const suggestedName = getFileNameFromHeaders(response.headers as AxiosResponseHeaders, defaultName, 'xlsx');

      const content = response.data;
      if (content) {
        downloadFromContent(content, suggestedName);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const exportExcelReport = async (urlPath, payload = {}, fileName = 'Report') => {
  const response = await axios.post(urlPath, payload, { responseType: 'blob' });
  if (response.status >= 200 && response.status < 300) {
    const suggestedName = getFileNameFromHeaders(response.headers as AxiosResponseHeaders, fileName, 'xlsx');
    const content = response.data;
    if (content) {
      downloadFromContent(content, suggestedName);
    }
  }
};
