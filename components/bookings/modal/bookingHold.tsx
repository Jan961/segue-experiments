import React, {useEffect, useState} from "react";
import {dateService} from "../../../services/dateService";
import {bookingService} from "../../../services/bookingService";
import {use} from "i18next";
import {async} from "rxjs";
import axios from "axios";
import {loggingService} from "../../../services/loggingService";



interface BookingHoldProps {
    TourID: null
}

export default function BookingHold({ TourId }){
    const [showModal, setShowModal] = React.useState(false);

    let [datesList, getDatesList] = React.useState([])
    const [holdTypes, setHoldTypes] = useState([])
    const [isLoading, setLoading] = useState(false)

    const [performanceList, setPerformanceList] = useState([]);

    const [inputs, setInputs] = useState({
        BookingId: 0,
        Performance: 0,
        Seats: 0,
        Notes: "",
    });
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    useEffect(() => {

        setLoading(true)


        // Get Saleable Bookings
        fetch(`/api/bookings/saleable/${TourId}`)
            .then((res) => res.json())
            .then((dates) => {
                getDatesList(dates)
            })
        setLoading(false)

    }, [TourId])

    function handleServerResponse(b: boolean, thankYouYourMessageHasBeenSubmitted: string) {

    }

    async function handleOnSubmit(e) {
        e.preventDefault();
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));
        await axios({
            method: 'POST',
            url: `/api/bookings/holds/bookingHold/create`,
            data: inputs,
        })
            .then((response) => {
                loggingService.logAction("Create Hold", "Update Add Hold ")

                handleServerResponse(
                    true,
                    'Thank you, your message has been submitted.',
                );
            })
            .catch((error) => {
                loggingService.logError(error)
                handleServerResponse(false, error.response.data.error);
            });

        setStatus({
            submitted: false,
            submitting: false,
            info: {error: false, msg: null},
        });
    };


  async  function handleOnChange(e) {
        e.persist();


        if(e.target.name === "BookingId"){
            await fetch(`/api/bookings/Performances/${e.target.value}`)
                .then((res) => res.json())
                .then((times) => {
                    setPerformanceList(times)
                })
        }


        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

    }

    return (
        <>
            <button
                className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1"
    type="button"
    onClick={() => setShowModal(true)}
>
    Booking Holds
    </button>
    {showModal ? (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll"
        >
        <div className="relative w-auto my-6 mx-auto max-w-6xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        {/*header*/}
        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
    <h3 className="text-3xl font-semibold">
       Booking Holds
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
        <div className="flex flex-row">
        <p className={"text-center p-10 h-15"}>
            Create a Hold
        </p>
        </div>


            <div className="flex flex-row">
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

            <div className="flex flex-row">
                <label htmlFor="date" className="">Notes</label>
                <textarea className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    id="Notes"
                    name="Notes"
                    required
                          onChange={handleOnChange}
                >
                    {inputs.Notes}
                </textarea>

            </div>



            <div className="flex flex-row">
    <label htmlFor="venueDistance" className="">Associate With booking</label>

    <select
        name={"BookingId"}
        id={"BookingId"}
        onChange={handleOnChange}
            >

            {datesList.length > 0 ?

                    datesList.map((date) => (
                        <>
                            <option value={date.BookingId}>{dateService.getWeekDay(date.ShowDate)} {dateService.dateToSimple(date.ShowDate)} </option>
    </>
    )) :
        <option value={""}>Tour has no dates</option>
    }

        </select>

        </div>

            <div className="flex flex-row">
                <label htmlFor="venueDistance" className="">Associate With Perfomance</label>

                <select
                    name={"Performance"}
                    id={"Performance"}
                    onChange={handleOnChange}
                >
                    {performanceList.length > 0 ?
                        <>
                            <option value={0}>All</option>
                        </>
                    : null
                    }

                        {performanceList.length > 0 ?

                        performanceList.map((time) => (
                                <option value={time.PerformanceId} id={time.PerformanceId}>{time.Time.substring(11,16)} </option>

                        )) :
                        <option value={""}>Tour has no performances</option>
                    }

                </select>

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
        type="submit" > Create Hold
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

