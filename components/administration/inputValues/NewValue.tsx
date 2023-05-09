import React, { useState } from "react";
import Link from "next/link";
import { JsConfigPathsPlugin } from "next/dist/build/webpack/plugins/jsconfig-paths-plugin";

import axios from "axios";
import { Show, Tour } from "../../../interfaces";
import { forceReload } from "../../../utils/forceReload";
import { userService } from "../../../services/user.service";
import { loggingService } from "../../../services/loggingService";

export default function NewValue() {
  const [showModal, setShowModal] = React.useState(false);
  // const userAccount = userService.userValue.accountId;
  const userAccount = userService.userValue;

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    Name: "",
    Value: "",
    OwnerId: userAccount.accountId,
    Type: "contactRole",
  });

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setInputs({
        Name: inputs.Name,
        Value: inputs.Value,
        OwnerId: userAccount.accountId,
        Type: inputs.Type,
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
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log("The inputs", inputs)
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    axios({
      method: "POST",
      url: "/api/inputValues/write", // Update the API endpoint
      data: inputs,
    })
      .then((response) => {
        loggingService.logAction("customInput", "Custom Input Value Created");
        handleServerResponse(
          true,
          "Thank you, your message has been submitted."
        );
        handleClose();
      })
      .catch((error) => {
        loggingService.logError(error);
        handleServerResponse(false, error.response.data.error);
      });
  };

  const handleClose = () => {
    setShowModal(false);
    forceReload();
  };

  return (
    <div className=" max-w-2/3 flex flex-row">
      <button
        className="bg-primary-blue text-white hover:bg-blue-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Add Value
      </button>
      {showModal ? (
        <div className="flex flex-col ">
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Add Value</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form onSubmit={handleOnSubmit}>
                  <div className="relative p-6 flex-auto">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className={"text-gray-700 small"}>
                          Details For New Input Value
                        </p>
                      </div>
                      <div>
                        <label htmlFor="Code" className="">
                          Name
                        </label>

                        <input
                          id="Name"
                          type="text"
                          name="name"
                          onChange={handleOnChange}
                          required
                          value={inputs.Name}
                          className="block w-full min-w-0 flex-1 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="XYZABC"
                          contentEditable={false}
                        />
                      </div>
                      <div>
                        <label htmlFor="Name" className="">
                          Value
                        </label>
                        <input
                          id="Value"
                          type="text"
                          name="value"
                          onChange={handleOnChange}
                          required
                          value={inputs.Value}
                          className="block w-full min-w-0 flex-1 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="ShowType" className="">
                          Value Type
                        </label>
                        <select
                          id="Type"
                          className="block w-full min-w-0 flex-1 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          name="Type"
                          onChange={handleOnChange}
                          value={inputs.Type}
                          required
                        >
                          <option value="contactRole">
                            Venue Contact Role
                          </option>
                          <option value="businessType">Business Type</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/*footer*/}
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
                      {!status.submitting
                        ? !status.submitted
                          ? "Submit"
                          : "Submitted"
                        : "Submitting..."}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}
    </div>
  );
}
