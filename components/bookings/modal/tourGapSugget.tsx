import React, {useEffect, useState} from "react";
import {barringService} from "../../../services/barringService";
import {tourService} from "../../../services/TourService";
import {da} from "date-fns/locale";
import {GetServerSideProps} from "next";
import {dateService} from "../../../services/dateService";
import {venueService} from "../../../services/venueService";
import {bookingService} from "../../../services/bookingService";


export default function TourGapsModal(data){
    const [showModal, setShowModal] = React.useState(false);

    const [barringCheck, setBarringCheck] = React.useState(false);
    let [gapsList, setGapsList] = React.useState([{venueId: "", name: "", ShowDate: undefined
    }])
    let [venueList, setVenueList] = React.useState([{
        "Venue1Id": "", "Venue2Id":"",  "Mileage": "", "TimeMins": "",
        "Name": undefined
    }])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)

        /**
         * Get List of dates
         */


        //let gaps = tourService.getTourGaps(data.TourId)
        fetch(`/api/tours/read/gaps/${data.data}`)
            .then((res) => res.json())
            .then((gaps) => {
                setGapsList(gaps)
            })
        setLoading(false)

    }, [])

    function handleOnSubmit() {
        // Create unconfrimed booking

        bookingService.updateBookingDay(date, "venueid")


    }


    const [date, setDate] = useState('');
    const [distance, setDistance] = useState('');
    const [venue, setVenue] = useState('');
    const [lastVenue, setLastVenue] = useState(0);

    async function formSearch(dist) {
        setDistance(dist)


        //get last venue

        setLastVenue(561)



        await fetch(`/api/venue/read/venueVenue/${lastVenue}/${distance}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(JSON.stringify(data))
                setVenueList(data)
            })
    }



    function reset() {
        setVenue("")
        setVenueList([{"Venue1Id": "", "Venue2Id":"",  "Mileage": "", "TimeMins": "", "Name" :""}])
        setDate("")
        setDistance("")
    }

    return (
        <>
            <button
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Gap Suggestions
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
                                        Gap Suggestions
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
                                        <p>
                                            Select a date then select a distance Segue will then search for possible
                                            location
                                        </p>
                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="date" className="">Tour Gap Date</label>
                                        <select
                                            name={"date"}
                                            id={"date"}
                                            onChange={(e) => setDate(e.target.value)}
                                            >
                                                    <option value="">Select a Date</option>
                                            {gapsList.map((date) => (
                                                <>
                                                    <option value={date.ShowDate}>{dateService.dateToSimple(date.ShowDate)}</option>
                                                </>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="venueDistance" className="">Select a Distance Miles (Estimated Time)</label>

                                        <select
                                            name={"distance"}
                                            id={"distance"}
                                            disabled={date === ''}
                                            onChange={(e) => formSearch(e.target.value)}
                                        >
                                            <option value={""}>Select a Distance</option>

                                                <>
                                                    <option value="25">25 </option>
                                                    <option value="50">50 </option>
                                                    <option value="100">100 </option>
                                                    <option value="125">125</option>
                                                    <option value="150">150</option>
                                                    <option value="175">175 </option>
                                                    <option value="200">200</option>
                                                </>
                                            ))
                                        </select>

                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="venueDistance" className="">Select a Venue</label>

                                        <select
                                            name={"distance"}
                                            id={"distance"}
                                            disabled={distance === ''}
                                            onChange={(e) => setDistance(e.target.value)}
                                        >

                                            {venueList.length > 0 ?

                                             venueList.map((venue) => (
                                                <>
                                                    <option value={venue.Venue1Id}>{venue.Name} Miles {venue.Mileage}, Time {venue.TimeMins})</option>
                                                </>
                                            )) :
                                                <option value={""}>Select a Distance</option>
                                            }

                                        </select>
                                            * Select a date and distance to filter venuw
                                    </div>





                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={reset}
                                        // THis will not save anything and discard the form
                                        >

                                        Reset
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
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit" >
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

    console.log(JSON.stringify(ctx))

    return {
        props: {

        },
    };


}