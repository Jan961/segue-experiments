import React, {useEffect, useState} from "react";
import {loggingService} from "../../../services/loggingService";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faSquareXmark, faUser} from "@fortawesome/free-solid-svg-icons";
import {da} from "date-fns/locale";
import {userService} from "../../../services/user.service";


interface BookingHoldProps {
    AvailableHoldId: number
}

export default function AddPromoterHold({AvailableHoldId}: BookingHoldProps) {
    const [showModal, setShowModal] = React.useState(false);
    const [hold, setHold] = useState([]);
    const [inputs, setInputs] = useState({
        TicketHolderName: "",
        Seats: 2,
        Comments: "",
        RequestedBy: "",
        ArrangedBy: userService.userValue.name,
        VenueConfirmationNotes: "",
        TicketHolderEmail: "",
        SeatsAllocated: "",
        HoldAllocationId:null

    });
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: {error: false, msg: null},
    });


    function handleServerResponse(b: boolean, thankYouYourMessageHasBeenSubmitted: string) {

    }

    async function handleOnSubmitHold(e) {
        e.preventDefault();


        setStatus((prevStatus) => ({...prevStatus, submitting: true}));



        setStatus({
            submitted: false,
            submitting: false,
            info: {error: false, msg: null},
        });

    }


    async  function handleOnChange(e) {
        e.persist();

        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

    }


    function handleOnSubmit(e) {
        e.preventDefault()
        setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
        axios({
            method: 'POST',
            url: `/api/bookings/holds/performanceHold/allocate/${AvailableHoldId}`,
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Promoter Hold Booking Update","Change booking details")

                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                );
                setShowModal(false)
            })
            .catch((error) => {
                loggingService.logError( error)
                handleServerResponse(false, error.response.data.error);
            });


    }

    return (
        <div className=" max-w-2/3 flex flex-row">
            <button
                className="bg-primary-blue text-white hover:bg-blue-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Add Hold
            </button>
            {showModal ? (
                <div className="flex flex-col ">
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">Performance Hold</h3>
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
                                                    Available Holds for this Booking
                                                </p>
                                            </div>
                                            <div >
                                                <label htmlFor="date" className="">Ticket Holder Name</label>
                                                <input
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={inputs.TicketHolderName}
                                                    id="TicketHolderName"
                                                    name="TicketHolderName"
                                                    type="text"
                                                    required
                                                    onChange={handleOnChange}
                                                />

                                            </div>
                                            <div >

                                                <label htmlFor="date" className="">Ticket Holder Email</label>
                                                <input
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={inputs.TicketHolderEmail}
                                                    id="TickerHolderEmail"
                                                    name="TickerHolderEmail"
                                                    type="email"
                                                    required
                                                    onChange={handleOnChange}
                                                />

                                            </div>
                                            <div >

                                                <label htmlFor="date" className="">Seats</label>
                                                <input
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={inputs.Seats}
                                                    id="Seats"
                                                    name="Seats"
                                                    type="number"
                                                    required
                                                    onChange={handleOnChange}
                                                />

                                            </div>

                                            <div >

                                                <label htmlFor="date" className="">Comments</label>
                                                <input
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black border"
                                                    id="Comments"
                                                    name="Comments"
                                                    defaultValue=""
                                                    onChange={handleOnChange}
                                                    value={inputs.Comments}
                                                />

                                            </div>


                                            <div >

                                                <label htmlFor="date" className="">Requested By</label>
                                                <input
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={inputs.RequestedBy}
                                                    id="RequestedBy"
                                                    name="RequestedBy"
                                                    type="text"
                                                    required
                                                    onChange={handleOnChange}
                                                />

                                            </div>

                                            <div >

                                                <label htmlFor="date" className="">Arranged By</label>
                                                <input
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={inputs.ArrangedBy}
                                                    id="ArrangedBy"
                                                    name="ArrangedBy"
                                                    type="text"
                                                    required
                                                    onChange={handleOnChange}
                                                />

                                            </div>

                                            <div >

                                                <label htmlFor="date" className="">Venue Confirmation Notes</label>
                                                <input
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black border"
                                                    id="VenueConfirmationNotes"
                                                    name="VenueConfirmationNotes"
                                                    defaultValue=""
                                                    onChange={handleOnChange}
                                                    value={inputs.VenueConfirmationNotes}
                                                />


                                            </div>

                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">

                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >

                                            Close and Discard
                                        </button>

                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit"
                                            onClick={handleOnSubmit}
                                        >


                                            <>Add Hold</>

                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>
            ) : null }
        </div>
    );
}

