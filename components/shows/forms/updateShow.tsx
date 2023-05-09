import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {JsConfigPathsPlugin} from "next/dist/build/webpack/plugins/jsconfig-paths-plugin";

import axios from 'axios';
import {Show, Tour, Venue} from "../../../interfaces";
import {router} from "next/client";
import {forceReload} from "../../../utils/forceReload";
import {loggingService} from "../../../services/loggingService";

type Props = {
    items: Show
}

export default function UpdateShow({items}: Props){

    const [showModal, setShowModal] = React.useState(false);
    const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const userLevel = 1  //TODO: get this from User

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        Code: items.Code,
        ShowId: items.ShowId,
        Name: items.Name,
        Logo: items.Logo,
        ShowType: items.ShowType,
        Published: items.published,
    });

    const handleServerResponse = (ok, msg) => {
        if (ok) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg },
            });
            setInputs({
                Code: inputs.Code,
                ShowId: inputs.ShowId,
                Name: inputs.Name,
                Logo: inputs.Logo,
                ShowType: inputs.ShowType,
                Published: items.published,
            });

        } else {
            // @ts-ignore
            setStatus(false);
        }
    };

    const handleClose = () => {
        setShowModal(false)
        forceReload()
    };

    const handleOnChange = (e) => {
        //e.persist();
        if (e.target.files && e.target.files[0]) {
            const i = e.target.files[0];
            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
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
        /**
         * If image hasn't changed imafge wont be set and wont overwrite
         */
    if(image) {
        const fd = new FormData()
        fd.append('file', image)
        let res = await fetch(`/api/fileUpload/upload`, {
            method: 'POST',
            headers: {},
            body: fd,
        })
        let response = await res.json();
        inputs.Logo = response.data
    }
        axios({
            method: 'POST',
            url: '/api/shows/update/' + items.ShowId,
            data: inputs,
        })
            .then((response) => {
                // @ts-ignore
                loggingService.logAction( "Show", "Show Updated")

                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                );
            handleClose()
            })
            .catch((error) => {
                loggingService.logError( error)

                handleServerResponse(false, error.response.data.error);
            });
    };




    return (
        <>
            <button
                className="bg-primary-blue text-white hover:bg-blue-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Update
            </button>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Update {items.Name}
                                    </h3>
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
                                                <p className={"text-gray-700 small" }>Details For New Show</p>
                                            </div>
                                            <div>
                                                <label htmlFor="Code" className="">Code</label>

                                                <input id="Code"
                                                       type="text"
                                                       name="Code"
                                                       onChange={handleOnChange}
                                                       required
                                                       value={inputs.Code}
                                                       className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                       placeholder="XYZABC"
                                                       contentEditable={false}
                                                />


                                            </div>
                                            <div>
                                                <label htmlFor="Name" className="">Name</label>
                                                <input id="Name"
                                                       type="text"
                                                       name="Name"
                                                       onChange={handleOnChange}
                                                       required
                                                       value={inputs.Name}
                                                       className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="ShowType" className="">Show Type</label>
                                                    <select
                                                        id="ShowType"
                                                        name="ShowType"
                                                        onChange={handleOnChange}
                                                        required
                                                        value={inputs.ShowType}
                                                    >
                                                        <option value="N">Normal</option>
                                                        <option value="P">Pantomime</option>
                                                    </select>
                                               
                                            </div>

                                            <div>
                                                <label htmlFor="Tour Logo" className="">Show Logo</label>
                                                <img src={createObjectURL} height="200px" width="200px"/>
                                                <input id="Logo"
                                                       type="file"
                                                       name="Logo"
                                                       onChange={handleOnChange}
                                                       className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                                                />
                                            </div>




                                        </div>
                                    </div>

                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={handleClose}
                                            // THis will not save anything and discard the form
                                        >

                                            Close and Discard
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit" disabled={status.submitting}>
                                            {!status.submitting
                                                ? !status.submitted
                                                    ? 'Submit'
                                                    : 'Submitted'
                                                : 'Submitting...'}
                                        </button>
                                    </div></form>
                                {/**}
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



