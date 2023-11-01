import React, { useState } from 'react';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';

export default function ActivityLog() {
  const [showModal, setShowModal] = React.useState(false);
  const [inputs, setInputs] = useState({
    DateFrom: null,
    DateTo: null,
  });

  function handleOnSubmit() {}

  function handleOnChange(e) {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }
  return (
    <>
      <SwitchBoardItem
        link={{
          icon: faFileLines,
          title: 'Activity Log',
          onClick: () => setShowModal(true),
          color: 'bg-primary-orange',
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
                  <h3 className="text-3xl font-semibold">Activity Log</h3>
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
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="DateFrom" className="">
                      First Date
                    </label>
                    <input
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.DateFrom}
                      id="DateFrom"
                      name="DateFrom"
                      type="date"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="DateTo" className="">
                      Last Date
                    </label>
                    <input
                      className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={inputs.DateTo}
                      id="DateTo"
                      name="DateTo"
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
                      {' '}
                      Generate Excel Report
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
