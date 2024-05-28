import moment from 'moment';
import { getMonday } from 'services/dateService';

export const onScheduleReport = async (ProductionId: number) => {
  return fetch('/api/reports/schedule-report', { method: 'POST', body: JSON.stringify({ ProductionId }) })
    .then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        const productionName = `${ProductionId}`;
        let suggestedName: string | any[] = response.headers.get('Content-Disposition');
        if (suggestedName) {
          suggestedName = suggestedName?.match?.(/filename="(.+)"/);
          suggestedName = suggestedName.length > 0 ? suggestedName[1] : null;
        }
        if (!suggestedName) {
          suggestedName = `${productionName}.xlsx`;
        }
        const content = await response.blob();
        if (content) {
          const anchor: any = document.createElement('a');
          anchor.download = suggestedName;
          anchor.href = (window.webkitURL || window.URL).createObjectURL(content);
          anchor.dataset.downloadurl = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            anchor.download,
            anchor.href,
          ].join(':');
          anchor.click();
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const exportBookingSchedule = async (ProductionId: number) => {
  return fetch('/api/reports/bookingSchedule', { method: 'POST', body: JSON.stringify({ ProductionId }) })
    .then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        const productionName = `${ProductionId}`;
        let suggestedName: string | any[] = response.headers.get('Content-Disposition');
        if (suggestedName) {
          suggestedName = suggestedName?.match?.(/filename="(.+)"/);
          suggestedName = suggestedName.length > 0 ? suggestedName[1] : null;
        }
        if (!suggestedName) {
          suggestedName = `${productionName}.xlsx`;
        }
        const content = await response.blob();
        if (content) {
          const anchor: any = document.createElement('a');
          anchor.download = suggestedName;
          anchor.href = (window.webkitURL || window.URL).createObjectURL(content);
          anchor.dataset.downloadurl = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            anchor.download,
            anchor.href,
          ].join(':');
          anchor.click();
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const exportMasterplanReport = async (fromDate: string, toDate: string) => {
  fetch('/api/reports/masterplan', {
    method: 'POST',
    body: JSON.stringify({
      fromDate: moment(getMonday(fromDate)).format('YYYY-MM-DD'),
      toDate: moment(new Date(toDate)).format('YYYY-MM-DD'),
    }),
  }).then(async (response) => {
    if (response.status >= 200 && response.status < 300) {
      let suggestedName: string | any[] = response.headers.get('Content-Disposition');
      if (suggestedName) {
        suggestedName = suggestedName.match(/filename="(.+)"/);
        suggestedName = suggestedName.length > 0 ? suggestedName[1] : null;
      }
      if (!suggestedName) {
        suggestedName = 'Report.xlsx';
      }
      const content = await response.blob();
      if (content) {
        const anchor: any = document.createElement('a');
        anchor.download = suggestedName;
        anchor.href = (window.webkitURL || window.URL).createObjectURL(content);
        anchor.dataset.downloadurl = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          anchor.download,
          anchor.href,
        ].join(':');
        anchor.click();
      }
    }
  });
};
