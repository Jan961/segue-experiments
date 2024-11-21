import React, { useEffect, useState } from 'react';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { formatDate, getMonday, newDate } from 'services/dateService';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import { Spinner } from 'components/global/Spinner';
import axios from 'axios';

export default function MasterPlan() {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    fromDate: '2020-01-02',
    toDate: '2023-02-01',
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/reports/booking/last')
      .then((data: any) => {
        setInputs({
          fromDate: data.FirstDate?.substring?.(0, 10) || formatDate(newDate(), 'yyy-MM-dd'),
          toDate: data?.data?.FirstDate?.substring?.(0, 10),
        });
      })
      .catch((error) => {
        console.log('Error fetching last booking date', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const downloadReport = async () => {
    setLoading(true);
    fetch('/api/reports/masterplan', {
      method: 'POST',
      body: JSON.stringify({
        fromDate: formatDate(getMonday(inputs.fromDate), 'yyyy-MM-dd'),
        toDate: formatDate(inputs.toDate, 'yyyy-MM-dd'),
      }),
    })
      .then(async (response) => {
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
          setShowModal(false);
          setInputs({
            fromDate: null,
            toDate: null,
          });
        }
      })
      .finally(() => {
        setStatus((prev) => ({ ...prev, submitting: false, submitted: true }));
        setLoading(false);
      });
  };

  const handleOnChange = (e) => {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    downloadReport();
  };

  return (
    <>
      <SwitchBoardItem
        link={{
          icon: faStar,
          title: 'All Shows Masterplan',
          onClick: () => setShowModal(true),
          color: 'bg-primary-blue',
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
                      Master Plan
                    </h3>
                  </div>
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
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
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="DateFrom" className="block text-sm font-medium text-gray-700">
                      From Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        value={inputs.fromDate}
                        onChange={handleOnChange}
                        className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="DateTo" className="block text-sm font-medium text-gray-700">
                      Last Date
                    </label>
                    <input
                      className="block w-full min-w-0 flex-1 shadow-sm rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.toDate}
                      id="toDate"
                      name="toDate"
                      type="date"
                      onChange={handleOnChange}
                    />
                  </div>
                  {/* footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
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
