import React, {useEffect, useState} from "react";
import {barringService} from "../../../services/barringService";
import {tourService} from "../../../services/TourService";
import {da} from "date-fns/locale";
import {GetServerSideProps} from "next";
import {dateService} from "../../../services/dateService";
import {venueService} from "../../../services/venueService";
import {bookingService} from "../../../services/bookingService";
import {forceReload} from "../../../utils/forceReload";
import {userService} from "../../../services/user.service";


export default function TourGapsModal(tourId){
    const [showModal, setShowModal] = React.useState(false);

    const [barringCheck, setBarringCheck] = React.useState(false);
    let [gapsList, setGapsList] = React.useState([{venueId: "", name: "", ShowDate: undefined,
        BookingId: undefined
    }])
    let [venueList, setVenueList] = React.useState([])
    const [isLoading, setLoading] = useState(false)

    const [inputs, setInputs] = useState({
        BookingId: 0,
        Distance: 0,
        VenueId: 0
    });

    const [date, setDate] = useState('');
    const [distance, setDistance] = useState('');
    const [venue, setVenue] = useState('');
    const [lastVenue, setLastVenue] = useState(0);
    const [submittable, setSubmittable] = useState(false);
    /**
     * Avalable dates
     */
    useEffect(() => {

        // @ts-ignore
        fetch(`/api/bookings/NotBooked/${tourId.TourId}`,{
            method: "GET"
        })
            .then((res) => res.json())
            .then((bookings) => {
                setGapsList(bookings)
            })
    }, [tourId.TourId]);

    /**
     *  Venue List
     * */
    useEffect(() => {
        if (lastVenue == 0) {

            fetch(`/api/venue/read/venueVenue/${lastVenue}/${inputs.Distance}`)
                .then((res) => res.json())
                .then((data) => {
                    setVenueList(data)
                })
        } else {

            fetch(`/api/venue/read/allVenues/${userService.userValue.accountAdmin}`)
                .then((res) => res.json())
                .then((data) => {
                    setVenueList(data)
                })
        }
    }, [inputs.Distance, lastVenue]);

    useEffect(() => {
        if(inputs.VenueId=== 0){
            setSubmittable(false)
        } else {
            setSubmittable(true)
        }
    }, [inputs.VenueId]);


    /**
     * Last Vennue
     */
    useEffect(() => {
        // @ts-ignore
        if(inputs.BookingId !== 0) {
            let data = {
                BookingId: inputs.BookingId,
                TourId: tourId.TourId
            }
            fetch(`/api/bookings/LastVenue/`, {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then((lastVenue) => {
                    if(lastVenue !== null) {
                        setLastVenue(lastVenue.venueId)
                    } else {
                        setLastVenue(0)
                    }
                })
        }
    }, [inputs.BookingId]);



    function handleOnSubmit(e) {
        e.preventDefault()

        alert("Submit Possioble")
        fetch(`/api/bookings/book/gap`,{
            method: "POST",
            body: JSON.stringify(inputs)
        })
            .then((res) => res.json())
            .then((bookings) => {
               alert(JSON.stringify(bookings))
            })


    }





    function reset() {
        setVenue("")
        setVenueList([])
        setDate("")
        setDistance("")
    }

    function handleOnChange(e) {
        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

        alert(JSON.stringify(inputs))
    }

    return (
        <>
            <button
                className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1"
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
                                            name={"BookingId"}
                                            id={"BookingId"}
                                            onChange={handleOnChange}
                                            >
                                                    <option value="">Select a Date</option>
                                            {gapsList.map((date) => (
                                                <>
                                                    <option value={date.BookingId}>{dateService.dateToSimple(date.ShowDate)}</option>
                                                </>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="venueDistance" className="">Select a Distance Miles (Estimated Time)</label>

                                        <select
                                            name={"Distance"}
                                            id={"Distance"}
                                            disabled={inputs.BookingId == 0}
                                            onChange={handleOnChange}
                                        >
                                            <option value={""}>Select a Distance</option>

                                                <>
                                                    <option value={25}>25 </option>
                                                    <option value={50}>50 </option>
                                                    <option value={100}>100 </option>
                                                    <option value={125}>125</option>
                                                    <option value={150}>150</option>
                                                    <option value={175}>175 </option>
                                                    <option value={200}>200</option>
                                                </>
                                            ))
                                        </select>

                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="venueDistance" className="">Select a Venue</label>

                                        <select
                                            name={"VenueId"}
                                            id={"VenueId"}
                                            disabled={inputs.Distance === null}
                                            onChange={handleOnChange}
                                        >

                                            {venueList.length > 0 ?

                                             venueList.map((venue) => (
                                                <>
                                                    <option value=

                                                                {venue.Venue1Id}

                                                              >{venue.Name}

                                                        Miles {venue.Mileage}, Time {venue.TimeMins})

                                                        </option>
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
                                            type="submit"
                                            disabled={!submittable}
                                        >
                                            Add Booking

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