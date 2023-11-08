import React, { useEffect, useState } from 'react';
import ExcelIcon from '../../global/icons/excelIcon';
import PdfIcon from '../../global/icons/pdfIcon';
import CsvIcon from '../../global/icons/csvIcon';

export default function Salesreport() {
  const [showModal, setShowModal] = React.useState(false);

  const [inputs, setInputs] = useState({
    fromDate: null,
    toDate: null,
    showTour: null,
    salesWeekNo: null,
    noWeeks: null,
    options: null,
    sortBy: null,
  });

  function handleOnSubmit() {}

  function handleOnChange() {
    // On venue Selection
    //
  }

  function resetForm() {
    alert('reset');
  }

  function setMonday() {
    inputs.toDate = '20-10-2022';
  }

  function clearField() {}

  return (
    <>
      <button
        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <ExcelIcon></ExcelIcon>
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/* content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Sales & Marketing - Sales Summary</h3>
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
                <form onSubmit={handleOnSubmit}>
                  <div className="flex flex-row m-10">
                    <label htmlFor="showTour" className="">
                      Show/Tour
                    </label>
                    <select
                      id="showTour"
                      name="showTour"
                      onChange={handleOnChange}
                      required
                      value={inputs.showTour}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Active Tours</option>
                    </select>
                  </div>
                  <div className="flex flex-row m-10">
                    <label htmlFor="saleweek" className="">
                      Sales Week Number
                    </label>

                    <select
                      id="salseWeekNo"
                      name="salseWeekNo"
                      onChange={handleOnChange}
                      required
                      value={inputs.salesWeekNo}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Sale Week Number</option>
                    </select>
                  </div>
                  <div className="flex flex-row m-10">
                    <label htmlFor="weeknumber" className="">
                      Week Number
                    </label>

                    <select
                      id="noWeeks"
                      name="noWeeks"
                      onChange={handleOnChange}
                      required
                      value={inputs.noWeeks}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Number of weeks</option>
                    </select>
                  </div>

                  <div className="flex flex-row m-10">
                    <label htmlFor="fromDate" className="">
                      From Tour Date
                    </label>

                    <input
                      id="fromDate"
                      type="date"
                      name="fromDate"
                      onChange={handleOnChange}
                      required
                      value={inputs.fromDate}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      contentEditable={true}
                    />
                    <button
                      type={'button'}
                      className={
                        'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                      }
                      onClick={setMonday}
                    >
                      Monday
                    </button>
                    <button
                      className={
                        'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                      }
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-row m-10">
                    <label htmlFor="Name" className="">
                      To Tour Date
                    </label>

                    <input
                      id="toDate"
                      type="date"
                      name="Date"
                      onChange={handleOnChange}
                      required
                      value={inputs.toDate}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Full Name"
                      contentEditable={true}
                    />
                    <button
                      className={
                        'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                      }
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-row m-10">
                    <label htmlFor="Name" className="">
                      Sort By
                    </label>

                    <select
                      id="sortBy"
                      name="sortBy"
                      onChange={handleOnChange}
                      required
                      value={inputs.sortBy}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Sort By</option>
                    </select>
                  </div>
                  <div className="flex flex-row m-10">
                    <label htmlFor="Name" className="">
                      Options
                    </label>

                    <select
                      id="options"
                      name="options"
                      onChange={handleOnChange}
                      required
                      value={inputs.options}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Number of weeks</option>
                    </select>
                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      type={'button'}
                      className={
                        'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                      }
                    >
                      Reporting Settings
                    </button>
                    <button
                      type={'button'}
                      className={
                        'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
                      }
                    >
                      Reset Form
                    </button>
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                      // THis will not save anything and discard the form
                    >
                      Close and Discard
                    </button>
                    <button
                      className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      <PdfIcon></PdfIcon> PDF
                    </button>
                    <button
                      className="bg-yellow-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      <CsvIcon></CsvIcon> CSV
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      <ExcelIcon></ExcelIcon> Excel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
