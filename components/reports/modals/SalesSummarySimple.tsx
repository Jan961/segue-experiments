import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { faPieChart } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { dateToSimple } from 'services/dateService';
import { getCurrentMondayDate, range } from 'services/reportsService';
import axios from 'axios';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import { Spinner } from 'components/global/Spinner';

type Props = {
  activeProductions: any[];
};

type ProductionWeek = {
  Id: number;
  mondayDate: string;
  productionWeekNum: number;
};
const defaultInputs = {
  production: null,
  productionWeek: null,
  numberOfWeeks: 2,
  order: null,
  productionStartDate: null,
  productionEndDate: null,
};
export const defaultStatus = {
  submitted: false,
  submitting: false,
  info: { error: false, msg: null },
};
export default function SalesSummarySimple({ activeProductions }: Props) {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [productionWeeks, setProductionWeeks] = useState<ProductionWeek[]>([]);
  const [status, setStatus] = useState(defaultStatus);
  const [inputs, setInputs] = useState(defaultInputs);
  const closeModal = () => {
    setShowModal(false);
    setInputs(defaultInputs);
    setStatus(defaultStatus);
  };

  const fetchProductionWeek = async (productionId: number) => {
    setLoading(true);
    const weeks: ProductionWeek[] = await axios
      .get(`/api/reports/productionWeek/${productionId}`)
      .then((data) => data.data)
      .finally(() => {
        setLoading(false);
      });
    setProductionWeeks(weeks);
    const currentWeekMonday = getCurrentMondayDate();
    setInputs((prev) => ({ ...prev, productionWeek: currentWeekMonday }));
  };

  const downloadReport = async () => {
    const selectedProduction = activeProductions.find((production) => production.Id === parseInt(inputs.production));
    const toWeek = inputs.productionWeek?.split('T')?.[0];
    const fromWeek = moment(inputs.productionWeek)
      .subtract(inputs.numberOfWeeks - 1, 'weeks')
      .toISOString()
      ?.split('T')?.[0];
    setLoading(true);
    fetch('/api/reports/sales-summary-simple', {
      method: 'POST',
      body: JSON.stringify({
        ProductionId: parseInt(inputs.production, 10),
        fromWeek,
        toWeek,
      }),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          const productionName: string = selectedProduction?.name;
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
          setStatus((prevStatus) => ({
            ...prevStatus,
            submitting: false,
            submitted: true,
            info: { error: false, msg: 'Report downloaded successfully' },
          }));
          closeModal();
        }
      })
      .catch((error) => {
        console.log('Error downloading report', error);
        setStatus((prevStatus) => ({
          ...prevStatus,
          submitting: false,
          info: { error: true, msg: 'Error downloading report' },
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (inputs.production) {
      fetchProductionWeek(inputs.production);
    }
  }, [inputs.production]);

  function handleOnSubmit(e) {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    downloadReport();
  }

  function handleOnChange(e) {
    if (e.target.name === 'production') {
      setProductionWeeks([]);
      const currentProduction = activeProductions.find((production) => production.Id === parseInt(e.target.value));
      if (currentProduction) {
        const { StartDate, EndDate } = currentProduction.DateBlock.find((date) => date.Name === 'Production') || {};
        setInputs((prev) => ({
          ...prev,
          productionStartDate: StartDate,
          productionEndDate: EndDate,
        }));
      }
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }
  return (
    <>
      <SwitchBoardItem
        link={{
          icon: faPieChart,
          title: 'Sales Summary',
          onClick: () => setShowModal(true),
          color: 'bg-primary-green',
        }}
      />
      {showModal ? (
        <>
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" />
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>
              <div
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="sm:flex justify-center">
                  <div className="mt-3 justify-center text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-xl text-center leading-6 font-medium text-gray-900" id="modal-headline">
                      Sales Summary Simple
                    </h3>
                  </div>
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeModal}>
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {loading && (
                  <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
                    <Spinner className="w-full" size="lg" />
                  </div>
                )}
                <form onSubmit={handleOnSubmit}>
                  <div className="mt-6">
                    <label htmlFor="date" className="text-lg font-medium">
                      Production
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.production}
                      id="production"
                      name="production"
                      onChange={handleOnChange}
                    >
                      <option>Select a Production</option>
                      {activeProductions?.map?.((production) => (
                        <option key={production.Id} value={`${production.Id}`}>
                          {production.ShowCode}
                          {production.Code} | {production.ShowName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="date" className="text-lg font-medium">
                      Production Week
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.productionWeek}
                      id="productionWeek"
                      name="productionWeek"
                      onChange={handleOnChange}
                    >
                      <option>Select a Production Week</option>
                      {productionWeeks.map((week) => (
                        <option key={week.mondayDate} value={`${week.mondayDate}`}>
                          {` Wk ${week.productionWeekNum} | ${dateToSimple(week?.mondayDate)}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="date" className="text-lg font-medium">
                      Number of weeks
                    </label>
                    <select
                      className="block w-full min-w-0 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.numberOfWeeks}
                      id="numberOfWeeks"
                      name="numberOfWeeks"
                      onChange={handleOnChange}
                    >
                      <option key="default">Select a timespan</option>
                      {range(2, 99).map((week, i) => (
                        <option key={i} value={week}>
                          {week}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col my-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Order
                    </label>
                    <select
                      className="block w-full min-w-0 flex-1  shadow-sm rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.order}
                      id="order"
                      name="Order"
                      onChange={handleOnChange}
                    >
                      <option value="date">Show Date</option>
                      <option value="sales">Show Sales (Low to Highest)</option>
                      <option value="change">Change (Lowest to highest)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={closeModal}
                    >
                      Close and Discard
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {!status.submitting
                        ? !status.submitted
                          ? 'Generate Excel Report'
                          : 'Downloaded'
                        : 'Creating Report...'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
