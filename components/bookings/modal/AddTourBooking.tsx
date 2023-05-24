import React, {useEffect, useState} from "react";
import {userService} from "../../../services/user.service";
import axios from "axios";

export default function AddTourBooking(tourId){
    const [showModal, setShowModal] = React.useState(false);
    const [accountVenues, setAccountVenues] = useState([]);
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
        TourID: tourId


    });

    useEffect(() => {
    fetch(`/api/venue/read/allVenues/${userService.userValue.accountId}`)
        .then((res) => res.json())
        .then((venues) => {
            setAccountVenues(venues)
        })
    }, []);


    function createBooking() {

        axios.post("/api/bookings/create")
            .then()
    }

    function handleOnSubmit() {

        createBooking()
    }

    async function handleOnChange(e) {

        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
        //On venue Selection
        setBarringCheck(false) // Barring check should be false (meaning no barring rules exclude this venue)



        if (e.target.name === "VenueName"){

            let venue = JSON.parse(e.target.value)
            inputs.VenueId = venue.VenueId
            inputs.Capacity = venue.Seats
            inputs.VenueName = venue.Name
            inputs.VenueId = venue.VenueId


        }

        /** thhe below code needs to run on every venue change
    */
        if(inputs.Date !== null && inputs.VenueId !== null || inputs.VenueId != 0){

            if(e.target.name == "dayTypeCast"){

                if( e.target.value === "Show"){
                    setBarringCheck(true)

                }
            }

fetch(`/api/bookings/LastVenue/${inputs.Date}/${inputs.TourID}`)
    .then((res) => res.json())
    .then((venue) => {
        setPreviousVenue(venue)

        fetch(`/api/Distance/${inputs.VenueId}/${venue.VenueId}`)
            .then((res) => res.json())
            .then((venueDistance) => {
                setPreviousDistance(venueDistance)
            })
    })

            fetch(`/api/bookings/NextVenue/${inputs.Date}/${inputs.TourID}`)
                .then((res) => res.json())
                .then((venue) => {
                        setNextVenue(venue)

                        fetch(`/api/Distance/${inputs.VenueId}/${venue.VenueId}`)
                            .then((res) => res.json())
                            .then((venueDistance) => {

                                setNextVenue(venueDistance)
                            })
                    })
            if (barringCheck){
                //  Do Barring Check logic
                // @ts-ignore
                fetch(`api/barring/list/${inputs.VenueId}/${previousVenue.VenueId}`)
                    .then((res) => res.json())
                    .then((barred) => {

                        if(barred.length !== 0){
                            setIsBarred(true)
                    } else  {
                            setIsBarred(false)
                        }
                    })

                // @ts-ignore
                fetch(`api/barring/${inputs.VenueId}/${NextVenue.VenueId}`)
                    .then((res) => res.json())
                    .then((barred) => {

                        if(barred.length !== 0){
                            setIsBarred(true)
                        } else  {
                            setIsBarred(false)
                        }
                    })
            }
        }
        //set Travel Distances from Venue venue Table
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
                TourID: undefined,
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
            Add Booking
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
                                            <input
                                                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={inputs.Date}
                                                id="Date"
                                                name="Date"
                                                type="date"
                                                required
                                                onChange={handleOnChange}
                                            />
                                            {inputs.Date}
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
                                            <label htmlFor="Capacity" className="flex flex-auto m-5">Capacity </label>


                                            <input
                                                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={inputs.Capacity}
                                                id="Capacity"
                                                name="Capacity"
                                                type="text"
                                                required
                                                onChange={handleOnChange}
                                            />
                                            <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-1.5 py-1 text-sm font-medium
                                                            leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset- 1 p-5">
                                                Change
                                            </button>
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
                                                <option value={"Rehearsal"}>Rehearsal</option>
                                                <option value={"Show"}>Show</option>
                                                <option value={"Rest"}>Rest</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-row">
                                            <label htmlFor="crewDetails" className="sr-only">crew Details</label>
                                            <input type="text" id="crewDetails" name="crewDetails" value="Scene, Port Glasgow"
                                                   className="flex flex-auto m-5"/>
                                        </div>
                                        <div className="flex flex-row">
                                            <label htmlFor="dayTypecrew" className="flex flex-auto m-5">Day Type (crew)</label>
                                            <select className="flex flex-auto m-5">
                                                <option>Fit Up</option>
                                                <option>Show</option>
                                                <option>Rest</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-row">
                                            <label htmlFor="venuStatus" className="flex flex-auto m-5">Venue Status</label>
                                            <select className="flex flex-auto m-5">
                                                <option>Confirmed</option>
                                                <option>Show</option>
                                                <option>Rest</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-row">
                                            <label htmlFor="runDays" className="flex flex-auto m-5">Run Days</label>
                                            <select className="flex flex-auto m-5">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                            </select>
                                            <label htmlFor="venuStatus" className="flex flex-auto m-5">Pencil #</label>
                                            <select className="flex flex-auto m-5">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-row">
                                            <label htmlFor="notes" className="">Notes</label>
                                            <textarea
                                                id="Notes"
                                                name="Notes"
                                                className="flex flex-auto m-5" value={inputs.Notes}>

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
