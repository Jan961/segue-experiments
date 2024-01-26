import React, { useState } from 'react';

import axios from 'axios';

export default function ViewForm() {
  const [showModal, setShowModal] = React.useState(false);
  const userLevel = 1; // TODO: get this from User

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    code: '',
    name: '',
    town: '',
    country: '',
    seats: 0,
    website: '',
    source: 0,
  });

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
      setInputs({
        code: '',
        name: '',
        town: '',
        country: '',
        seats: 0,
        website: '',
        source: 0, // TOdo: change to account id
      });
    } else {
      // @ts-ignore
      setStatus(false);
    }
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
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    axios({
      method: 'POST',
      url: '/api/venue/add',
      data: inputs,
    })
      .then((response) => {
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.',
          // Todo: router setlocation to the new venue to allow user to add the rest fo the detils
        );
        console.log(JSON.stringify(handleServerResponse));
      })
      .catch((error) => {
        handleServerResponse(false, error.response.data.error);
      });
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white hover:bg-blue-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Add Venue
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/* content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Add Custom Venue</h3>
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
                  <div className="relative p-6 flex-auto">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className={'text-gray-700 small'}>
                          Enter Basic Details for new Venue, Further information can be added on the next screen
                        </p>
                      </div>
                      <div>
                        <label htmlFor="code" className="">
                          Code
                        </label>

                        <input
                          id="code"
                          type="text"
                          name="code"
                          onChange={handleOnChange}
                          required
                          value={inputs.code}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="XYZABC"
                          contentEditable={false}
                        />
                      </div>
                      <div>
                        <label htmlFor="name" className="">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          onChange={handleOnChange}
                          required
                          value={inputs.name}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="code" className="">
                          Town
                        </label>

                        <input
                          id="town"
                          type="text"
                          name="town"
                          onChange={handleOnChange}
                          required
                          value={inputs.town}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Glasgow"
                          contentEditable={false}
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="">
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          name="country"
                          onChange={handleOnChange}
                          required
                          value={inputs.country}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="seats" className="">
                          Seats
                        </label>
                        <input
                          id="seats"
                          type="number"
                          name="seats"
                          onChange={handleOnChange}
                          required
                          value={inputs.seats}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="">
                          Website URL
                        </label>
                        <input
                          id="website"
                          type="text"
                          name="website"
                          onChange={handleOnChange}
                          required
                          value={inputs.website}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      {/* TODO: Replace with account ID */}

                      {userLevel !== 1 ? (
                        <div>
                          {/* this will only show on ADMIN Accounts */}
                          <label htmlFor="source" className="">
                            Scope
                          </label>
                          <p className={'text-gray-700 small'}>
                            {' '}
                            Creating a venue with as global will add this venue to the all accounts on Segue Platform
                          </p>

                          <select name="source" id="source">
                            <option value={0}>Global - Update all lists</option>
                            <option value={1}>Account - Update this lists</option> {/* TODO: Replace with account ID */}
                          </select>
                        </div>
                      ) : (
                        <div>
                          {/* This is a Standard User / Production User Account */}
                          <label htmlFor="source" className="">
                            Scope of Change
                          </label>
                          <p className={'text-gray-700 small'}>
                            You are adding a venue to your account only, To request a venue is added to the global
                            database contact Segue Support
                          </p>
                          <input type="hidden" name="source" id="source" value="1" />
                        </div>
                      )}
                    </div>
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
                      disabled={status.submitting}
                    >
                      {!status.submitting ? (!status.submitted ? 'Submit' : 'Submitted') : 'Submitting...'}
                    </button>
                  </div>
                </form>
                {/** }
                            {status.info.error && (
                                <div className="bg-red-800 text-black">Error: {status.info.msg}</div>
                            )}
                            {!status.info.error && status.info.msg && <p>{status.info.msg}</p>}
 */}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
