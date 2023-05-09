import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import PerfomancesList from "../perfomancesList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {dateService} from "../../../services/dateService";
import {userService} from "../../../services/user.service";
import Select
    from "@react-buddy/ide-toolbox/dist/previews/tools-panel/props-edit-table/table-items/table-item/table-item-control/select";
import axios from "axios";
import {Alert} from "../../alert";
import AddPerfomance from "./AddPerfomance";


interface AddBookingProps {
    TourId: number,
}

export default function AddBooking(TourId  : AddBookingProps){
    const [showModal, setShowModal] = React.useState(false);
    const [bookableBookings, setBookableBookings] = useState([]);
    const [accountVenues, setAccountVenues] = useState([]);
    const [dayTypes, setDayTypes] = useState([]);

    const [previousDistance, setPreviousDistance] = useState({
        VenueID: null, Venue2Id: null, Mileage: null, TimeMins:null
    });
    const [previousVenue, setPreviousVenue] = useState({});
    const [nextVenue, setNextVenue] = useState({});
    const [nextDistance, setNextDistance] = useState({
        VenueID: null, Venue2Id: null, Mileage: null, TimeMins:null
    });
    const [isBarred, setIsBarred] = useState(false);
    const [barringCheck, setBarringCheck] = React.useState(false);
    const [inputs, setInputs] = useState({
        Date: "",
        VenueName: null,
        Capacity: 0,
        DayTypeCast:"",
        CastLocation: "",
        DayTypeCrew: "",
        CrewLocatrion: "",
        VenueStatus: "",
        RunDays: "",
        PencilNo: "",
        Notes: "",
        PerformancePerDay: 0,
        Performance1: "",
        Performance2: "",
        VenueId: 0,
        TourID: TourId.TourId


    });


    useEffect(() => {
        fetch(`/api/venue/read/allVenues/${userService.userValue.accountId}`)
            .then((res) => res.json())
            .then((venues) => {
                setAccountVenues(venues)
            })
    }, []);

    useEffect(() => {

        // @ts-ignore
        fetch(`/api/bookings/NotBooked/${TourId.TourId}`)
            .then((res) => res.json())
            .then((bookings) => {
                setBookableBookings(bookings)
            })
    }, [TourId]);

    useEffect(() => {

        // @ts-ignore
        fetch(`/api/utilities/dropdowns/dayTypes`)
            .then((res) => res.json())
            .then((dayTypes) => {
                setDayTypes(dayTypes)
            })
    }, [TourId]);


    function handleOnSubmit() {

        //Update Booking as all booking dates already exsits

    }

    async function handleOnChange(e) {
        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));



    }

    function   handleOnClose(){
        setInputs({
                Capacity: 0,
                CastLocation: "",
                CrewLocatrion: "",
                Date: "",
                DayTypeCast: "",
                DayTypeCrew: "",
                Notes: "",
                PencilNo: "",
                Performance1: "",
                Performance2: "",
                PerformancePerDay: 0,
                RunDays: "",
                TourID: TourId.TourId,
                VenueId: 0,
                VenueName: null,
                VenueStatus: ""
            }
        )
        setBarringCheck(false)
        setIsBarred(false)
        setShowModal(false)
    }


    // @ts-ignore
    return (
        <>
            <button
                className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1 ml-8"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Add Booking 1
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
                                        Add Booking
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
                                        <label htmlFor="date" className="">Date</label>
                                        <select
                                            id="Booking"
                                            name="Booking"
                                            onChange={handleOnChange}
                                        >
                                        <option >Please Select a Date</option>
                                        {bookableBookings.map((booking) => (
                                            <option value={booking.BookingId }> { dateService.dateToSimple(booking.ShowDate)}</option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="venueName" className="">Venue</label>

                                        <select
                                            id="VenueName"
                                            name="VenueName"
                                            onChange={handleOnChange}
                                        >
                                            <option >Please Select a Venue</option>
                                            {accountVenues.map((venue) => (
                                                <option value={ JSON.stringify(venue)}>{venue.Name}</option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="dayTypeCast" className="flex flex-auto m-5">Day Type (Cast)</label>
                                        <select className="flex flex-auto m-5"
                                                id="dayTypeCast"
                                                name="dayTypeCast"
                                                required
                                                onChange={handleOnChange}
                                        >
                                            <option >Please Select a Day Type</option>
                                            {dayTypes.map((dayType) => (
                                                <option value={dayType.DayTypeId}>{dayType.Name}</option>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="LocationCast" className="sr-only">crew Details</label>
                                        <input type="text"
                                               id="LocationCast"
                                               name="LocationCast"
                                               value="Scene, Port Glasgow"
                                               onChange={handleOnChange}
                                               className="flex flex-auto m-5"/>
                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="dayTypecrew" className="flex flex-auto m-5">Day Type (crew)</label>
                                        <select className="flex flex-auto m-5"
                                                id="dayTypeCrew"
                                                name="dayTypeCrew"
                                                required
                                                onChange={handleOnChange}
                                        >
                                            <option >Please Select a Day Type</option>
                                            {dayTypes.map((dayType) => (
                                                <option value={dayType.DayTypeId}>{dayType.Name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="LocationCrew" className="sr-only">crew Details</label>
                                        <input type="text"
                                               id="LocationCrew"
                                               name="LocationCrew"
                                               value="Scene, Port Glasgow"
                                               onChange={handleOnChange}
                                               className="flex flex-auto m-5"/>
                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="VenuStatus" className="flex flex-auto m-5">Venue Status</label>
                                        <select className="flex flex-auto m-5"
                                                id="VenuStatus"
                                                name="VenuStatus"
                                                onChange={handleOnChange}
                                        >
                                            <option value={"C"}>Confirmed</option>
                                            <option value={"U"}>Confirmed</option>
                                            <option value={"X"}>Canceled</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-row">
                                        <label htmlFor="notes" className="">Notes</label>
                                        <textarea
                                            onChange={handleOnChange}
                                            id="Notes"
                                            name="Notes"
                                            className="flex flex-auto m-5" >
                                            {inputs.Notes}
                                            </textarea>
                                    </div>

                                    <div className="flex flex-row">
                                    </div>
                                    { previousDistance.Mileage !== null ? (
                                        <>
                                            <div className="flex flex-row  m-1 p-3" >
                                                <p>
                                                    Distance from Previous Venue {previousDistance.Mileage} Miles {previousDistance.TimeMins}</p>
                                            </div>
                                        </>) :null}
                                    { nextDistance.Mileage !== null ? (
                                        <>
                                            <div className="flex flex-row  m-1 p-3" >
                                                <p>
                                                    Distance from Previous Venue {nextDistance.Mileage} Miles {nextDistance.TimeMins}</p>
                                            </div>
                                        </>) :null}
                                    { isBarred ? (
                                        <>
                                            <div className="flex flex-row text-2xl bg-red-700 m-1 p-3" >
                                                <p className={"text-cyan-50"}>This venue has has failed barring check, Click Save to accept this exception</p>
                                            </div>
                                        </>) :(null)}

                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => handleOnClose()}
                                            // THis will not save anything and discard the form
                                        >
                                            Close and Discard
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit" >
                                            Save Booking
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}