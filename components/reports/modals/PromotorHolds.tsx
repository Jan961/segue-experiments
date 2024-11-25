import React, { useState } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import { Spinner } from 'components/global/Spinner';
import { defaultStatus } from './SalesSummarySimple';
import { newDate } from 'services/dateService';

type Props = {
  activeProductions: any[];
};
export default function PromotorHolds({ activeProductions }: Props) {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inputs, setInputs] = useState({
    dateFrom: null,
    dateTo: null,
    production: null,
    venue: null,
  });
  const [status, setStatus] = useState(defaultStatus);
  const [venues, setVenues] = useState([]);
  function handleOnSubmit(e) {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    downloadReport();
  }

  function closeForm() {
    setInputs({
      dateFrom: null,
      dateTo: null,
      production: null,
      venue: null,
    });
    setVenues([]);
    setStatus(defaultStatus);
    setShowModal(false);
  }

  const downloadReport = async () => {
    const selectedProduction = activeProductions.find((production) => production.Id === parseInt(inputs.production));
    setLoading(true);
    fetch('/api/reports/promoter-holds', {
      method: 'POST',
      body: JSON.stringify({
        productionId: parseInt(inputs?.production, 10),
        productionCode: selectedProduction ? `${selectedProduction?.ShowCode}${selectedProduction?.Code}` : null,
        fromDate: inputs.dateFrom,
        toDate: inputs.dateTo,
        venue: inputs.venue,
        exportedAt: newDate().toISOString(),
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
            anchor.href = (window.webkitURL || window.URL).createObjectURL(content);
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
          setShowModal(false);
          setInputs({
            production: null,
            dateFrom: null,
            dateTo: null,
            venue: null,
          });
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

  async function handleOnChange(e) {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));

    if (e.target.name === 'production') {
      // Load Venues for this production
      setVenues([]);
      setLoading(true);
      await fetch(`api/productions/read/venues/${e.target.value}`)
        .then((res) => res.json())
        .then((data) => data)
        .then((data) => {
          setInputs((prevState) => ({ ...prevState, Venue: null }));
          setVenues(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <>
      <SwitchBoardItem
        link={{
          icon: faUser,
          title: 'Promoter Holds',
          onClick: () => setShowModal(true),
          color: 'bg-primary-pink',
        }}
      />
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/* content */}
              <div className="px-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Promoter Holds</h3>
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
                    <label htmlFor="date" className="">
                      Production
                    </label>
                    <select
                      required
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.production}
                      id="production"
                      name="production"
                      onChange={handleOnChange}
                    >
                      <option>Select a Production</option>
                      {activeProductions.map((production) => (
                        <option key={production.Id} value={production.Id}>
                          {production.ShowCode}
                          {production.Code} | {production.ShowName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="dateFrom" className="">
                      From Date
                    </label>
                    <input
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.dateFrom}
                      id="dateFrom"
                      name="dateFrom"
                      type="date"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="date" className="">
                      To Date
                    </label>
                    <input
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.dateTo}
                      id="dateTo"
                      name="dateTo"
                      type="date"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="date" className="">
                      Venue
                    </label>
                    <select
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.venue}
                      id="venue"
                      name="venue"
                      onChange={handleOnChange}
                    >
                      <option key="all" value={null}>
                        All
                      </option>
                      {venues.map((venue) => (
                        <option key={venue.Id} value={venue.Code}>
                          {venue.Name}
                        </option>
                      ))}
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
