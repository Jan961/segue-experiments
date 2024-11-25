import React, { useState } from 'react';
import IconWithText from '../IconWithText';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { dateToSimple, getMonday, newDate } from 'services/dateService';
import { Spinner } from 'components/global/Spinner';

type Props = {
  activeProductions: any[];
};

export default function SalesSummary({ activeProductions }: Props) {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [productionWeeks, setProductionWeeks] = useState([]); // Shory list of productions for the toolbar to switch

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    Production: null,
    ProductionWeek: null,
    numberOfWeeks: null,
    order: null,
    productionStartDate: null,
    productionEndDate: null,
  });

  function closeForm() {
    setInputs({
      Production: null,
      ProductionWeek: null,
      numberOfWeeks: null,
      order: null,
      productionStartDate: new Date(),
      productionEndDate: new Date(),
    });
    setProductionWeeks([]);
    setShowModal(false);
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
  }

  async function handleOnChange(e) {
    e.persist();
    if (e.target.name === 'Production') {
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
      setLoading(true);
      fetch(`/api/reports/productionWeek/${e.target.value}`)
        .then((res) => res.json())
        .then((data) => {
          // Make sure production weeks are empty
          setProductionWeeks([]);
          // Set production weeks with data
          setProductionWeeks(data?.data || []);
          const currentWeekMonday = getMonday(newDate());
          setInputs((prev) => ({ ...prev, ProductionWeek: currentWeekMonday }));
        })
        .finally(() => {
          setLoading(false);
        });
    }

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <>
      <IconWithText icon={faChartPie} text="Sales Summary" onClick={() => setShowModal(true)} />
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll p-10">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/* content */}
              <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Sales Summary</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/* body */}
                {loading && (
                  <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
                    <Spinner className="w-full" size="lg" />
                  </div>
                )}
                <form onSubmit={handleOnSubmit}>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="date" className="text-lg font-medium">
                      Production
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.Production}
                      id="Production"
                      name="Production"
                      onChange={handleOnChange}
                    >
                      <option>Select a Production</option>
                      {activeProductions.map((production) => (
                        <option key={production.Id} value={`${production.Id}`}>
                          {production.ShowCode}/{production.Code} | {production.ShowName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <input
                      type="hidden"
                      name="productionStartDate"
                      id="productionStartDate"
                      value={inputs.productionStartDate}
                    />
                    <input
                      type="hidden"
                      name="productionEndDate"
                      id="productionEndDate"
                      value={inputs.productionEndDate}
                    />
                    {inputs.productionStartDate != null ? (
                      <p className="text-lg">
                        Production Dates {dateToSimple(inputs.productionStartDate)} to{' '}
                        {dateToSimple(inputs.productionEndDate)}
                      </p>
                    ) : (
                      <p className="text-lg">Select a Production to populate report filters</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="date" className="text-lg font-medium">
                      Production Week
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.ProductionWeek}
                      id="ProductionWeek"
                      name="ProductionWeek"
                      onChange={handleOnChange}
                    >
                      {productionWeeks.map((week) => (
                        <option key={week.MondayDate} value={`${week.MondayDate}`}>
                          {week?.Description || dateToSimple(week?.MondayDate)}{' '}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
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
                      <option>Select a timespan</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
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

                  {/* footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => closeForm()}
                      // THis will not save anything and discard the form
                    >
                      Close and Discard
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {' '}
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
