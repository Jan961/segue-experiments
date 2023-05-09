import React, {useState} from 'react'
import Link from 'next/link'
import {JsConfigPathsPlugin} from "next/dist/build/webpack/plugins/jsconfig-paths-plugin";

import axios from 'axios';
import {Show, Tour} from "../../../interfaces";
import {forceReload} from "../../../utils/forceReload";
import UserListItem from "../manage-users/userListItem";
import {areIntervalsOverlappingWithOptions} from "date-fns/fp";
import {tr} from "date-fns/locale";
import {loggingService} from "../../../services/loggingService";


export default function DeleteUser(userId){

    const [showModal, setShowModal] = React.useState(false);


    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const [inputs, setInputs] = useState({
        Name: "",
        userToDelete: userId.UserId
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
                userToDelete: inputs.userToDelete,
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
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));



        axios({
            method: 'POST',
            url: '/api/users/delete',
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Delete User", "Deleted account User : " + userId)
                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                );
                handleClose()
            })
            .catch((error) => {
                handleServerResponse(false, error.response.data.error);
            });
    };

    const handleClose = () => {
        setShowModal(false)
        forceReload()
    };



    return (
        <>
            <button
                className="bg-white text-black hover:bg-red-400 active:bg-red-600 font-bold text-md px-1 py-0 hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border border-2 border-black"
                type="button"
                onClick={() => setShowModal(true)}
            >
                —
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
                                        Delete User
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
                                                <p className={"text-gray-700 font-medium" }>Delete User</p>
                                                <p className={"text-gray-600 small" }>
                                                    Please select the user you wish any outstanding tasks to be assigned
                                                    to
                                                </p>
                                            </div>
                                            <div>
                                                <label htmlFor="Name" className="">Name</label>

                                                <input type="hidden"
                                                       name="userToDelete"
                                                       id="UserToDelete"
                                                       value={inputs.userToDelete}
                                                       contentEditable={false}
                                                />
                                                <select id="Name"

                                                       name="name"
                                                       onChange={handleOnChange}
                                                       required
                                                       value={inputs.Name}
                                                       className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                       placeholder="Jo Bloggs"
                                                       contentEditable={false}
                                                >
                                                    <option>User 1</option>
                                                    <option>User 2</option>
                                                    <option>User 3</option>
                                                </select>


                                            </div>


                                        </div>






                                    </div>





                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-emerald-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            // THis will not save anything and discard the form
                                        >

                                            Close and Discard
                                        </button>
                                        <button
                                            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit" disabled={status.submitting}>
                                            {!status.submitting
                                                ? !status.submitted
                                                    ? 'Submit'
                                                    : 'Submitted'
                                                : 'Submitting...'}
                                        </button>
                                    </div></form>

                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}



