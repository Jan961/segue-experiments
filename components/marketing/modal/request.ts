import axios from 'axios';
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

export const exportSalesSummaryReport = async ({ production, productionWeek, numberOfWeeks }) => {
  const toWeek = productionWeek?.split('T')?.[0];
  const fromWeek = moment(productionWeek)
    .subtract(numberOfWeeks - 1, 'weeks')
    .toISOString()
    ?.split('T')?.[0];
  fetch('/api/reports/sales-summary-simple', {
    method: 'POST',
    body: JSON.stringify({
      ProductionId: parseInt(production, 10),
      fromWeek,
      toWeek,
    }),
  })
    .then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        const productionName = 'Sales Summary';
        let suggestedName: string | any[] = response.headers.get('Content-Disposition');
        if (suggestedName) {
          suggestedName = suggestedName.match(/filename="(.+)"/);
          suggestedName = suggestedName.length > 0 ? suggestedName[1] : null;
        }
        if (!suggestedName) {
          suggestedName = `${productionName}.xlsx`;
        }
        const content = await response.blob();
        if (content) {
          const anchor: any = document.createElement('a');
          anchor.download = suggestedName;
          const url = (window.webkitURL || window.URL).createObjectURL(content);
          anchor.href = url;
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
      console.log('Error downloading report', error);
    });
};
