import React, {useEffect, useState} from "react";
import {dateService} from "../../../services/dateService";
import {bookingService} from "../../../services/bookingService";


export default function Holds(data){
    const [showModal, setShowModal] = React.useState(false);

    let [datesList, getDatesList] = React.useState([])
    const [holdTypes, setHoldTypes] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)

        /**
         * Get List of dates
         */


        //let gaps = tourService.getTourGaps(data.TourId)
        fetch(`/api/tours/read/tourDates/4`)
            .then((res) => res.json())
            .then((dates) => {
                getDatesList(dates)
            })
        fetch(`/api/bookings/holds/types`)
            .then((res) => res.json())
            .then((data) => {
                setHoldTypes(data)
            })
        setLoading(false)

    }, [])

    function handleOnSubmit() {
       // bookingService.createHolds(data)


    }

    return (
        <>
            <button
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Holds
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
                                        Holds
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
                                            Create a Hold for
                                        </p>
                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="seats" className="">Available Seats</label>
                                        <input key={"seats"}
                                            type={"number"}
                                        />


                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="seats" className="">Notes</label>
                                        <textarea key={"notes"}

                                        />


                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="type" className="">Type</label>
                                        <select
                                            name={"holdType"}
                                            id={"holdType"}

                                        >

                                            {holdTypes.length > 0 ?

                                                holdTypes.map((hold) => (
                                                    <>
                                                        <option value={hold.HoldId}>{hold.HoldName}</option>
                                                    </>
                                                )) :
                                                <option value={""}>Select a hold type</option>
                                            }

                                        </select>

                                    </div>


                                    <div className="flex flex-row">
                                        <label htmlFor="venueDistance" className="">Associate With Performance</label>

                                        <select
                                            name={"performance"}
                                            id={"performance"}
                                        >
                                            {datesList.length > 0 ?

                                                datesList.map((date) => (
                                                    <>
                                                        <option value={date.BookingId}>{dateService.getWeekDay(date.ShowDate)} {dateService.dateToSimple(date.ShowDate)} {dateService.dateTimeToTime(date.Performance1Time)}</option>
                                                    </>
                                                )) :
                                                <option value={""}>Tour has no dates</option>
                                            }

                                        </select>

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

