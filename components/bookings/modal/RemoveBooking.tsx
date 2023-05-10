import React, {useEffect, useState} from "react";
import {barringService} from "../../../services/barringService";
import {tourService} from "../../../services/TourService";
import {da} from "date-fns/locale";
import {GetServerSideProps} from "next";
import {dateService} from "../../../services/dateService";
import {venueService} from "../../../services/venueService";
import {bookingService} from "../../../services/bookingService";
import {forceReload} from "../../../utils/forceReload";


export default function RemoveBooking(bookingId){
    const [showModal, setShowModal] = React.useState(false);




    function handleOnSubmit(e) {
        e.preventDefault()

        alert("deletre")
        console.log("DELETE --------------------------")
        fetch(`/api/bookings/delete/`,{
            method: 'POST',
            body:  bookingId.BookingId
        })
        forceReload();
        setShowModal(false)
    }

    return (
        <>
            <button
                className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Remove Booking
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
                                        Delete Booking {JSON.stringify(bookingId)}
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
                                        <div className={"flex flex-col m-2"}>
                                        <p>
                                            Warning! You are about to delete a booking!
                                        </p>
                                            <p>
                                                 This will remove it from the system All related data will also be discarded
                                            </p>
                                </div>
                                    </div>







                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            onClick={() => setShowModal(false)}>
                                            Close and Cancel
                                        </button>

                                        <button
                                            className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"

                                            type="submit"

                                            // THis will not save anything and discard the form
                                        >

                                            Delete Booking
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    return {
        props: {

        },
    };


}