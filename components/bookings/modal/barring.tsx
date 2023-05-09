

import React, { useCallback, useEffect, useState } from "react";
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import saveAs from "file-saver";
import {userService} from "../../../services/user.service";
import axios from "axios";
import {dateService} from "../../../services/dateService";
import BarringVenueList from "../partial/barringVenueList";
import moment from "moment/moment";
import {barringService} from "../../../services/barringService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons/faCircleInfo";



export default function Barring(){
    const [showModal, setShowModal] = React.useState(false);
    const [pres, setPres] = useState([]);
    const [activeTours, setActiveTours] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [salesWeeks, SetSalesWeeks] = useState([])
    const [salesWeeksVenues, SetSalesWeeksVenues] = useState([])
    const [activeSetTours, setActiveSetTours] = useState([])
    const [inputs, setInputs] = useState({
        SetTour: null,
        venueDate: null,
        barDistance: 0,
        London: false,
        TourOnly: false,
        Seats:0
    });
    const [venues, setVenues] = useState([])
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });
    const [barringVenues, setBarringVenues] = useState(null);

    useEffect(() => { (async() => {
        fetch(`/api/tours/read/notArchived/${userService.userValue.accountId}`)
            .then((res) => res.json())
            .then((data) => {
                setActiveTours(data)

                setLoading(false)
            })

    })(); }, []);


    async function handleOnSubmit(e) {
        e.preventDefault();
        setStatus((prevStatus) => ({...prevStatus, submitting: true}));

        let BarringVenueList = fetch(`/api/barring/${inputs.venueDate}/${inputs.SetTour}/${inputs.barDistance}/${inputs.London}/${inputs.TourOnly}/${inputs.Seats}`)
            .then(barredVenueList=> (barredVenueList.json()))
            .then(barredVenueList =>(
                setBarringVenues(barredVenueList)
            ))

    }

    function closeForm(){

        setInputs({
            SetTour: null,
            venueDate: null,
            barDistance: 0,
            London: false,
            TourOnly: false,
            Seats:0
        })
        setVenues([])

        setShowModal(false)

    }

    function setVenueWeek(){
        // @ts-ignore
        let MondayDate = moment(new Date("2000-01-01")) //moment(new Date(RawMondayDate)).format("yyyy-MM-DD")
        // @ts-ignore
        let SundayDate = moment(new Date("2036-01-01")) //moment(new Date(RawMondayDate)).add(6,"days").format("yyyy-MM-DD")

        fetch(`/api/bookings/ShowWeek/${inputs.SetTour}/${MondayDate}/${SundayDate}`)
            .then(res => res.json())
            .then(res => {
                SetSalesWeeksVenues(res)
            })

    }

    async function handleOnChange(e) {

        e.persist();
        setInputs((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));

        if (e.target.name == "SetTour") {
            // Load Venues for this tour
            await setVenueWeek()

        }


    }

    // @ts-ignore
    return (
        <>

            <button
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Barring
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
                                        Barring
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

                                    <div className="flex flex-row space-x-2 space-y-2">
                                        <label htmlFor="date" className="">Tour</label>
                                        <select

                                            id="SetTour"
                                            name="SetTour"
                                            value={inputs.SetTour}
                                            onChange={handleOnChange}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                        >
                                            <option value={0}>Select A Tour</option>
                                            {activeTours.map((tour) => (
                                                <option key={tour.TourId} value={`${tour.TourId}`} >{tour.Show.Code}/{tour.Code} | {tour.Show.Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-row space-x-2 space-y-2">
                                        <label htmlFor="date" className="">Venue/Date</label>
                                        <select

                                            id="venueDate"
                                            name="venueDate"
                                            value={inputs.venueDate}
                                            onChange={handleOnChange}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                        >
                                            <option value={0}>Select A Tour</option>
                                            {salesWeeksVenues.map((item) => (
                                                <option value={item.VenueId}>{dateService.dateToSimple(new Date(item.ShowDate))} - {item.Venue.Name})</option>
                                            ))}
                                        </select>
                                    </div>



                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <label htmlFor="date" className="">Bar Distance</label>
                                        <input
                                            type={"number"}
                                            id="barDistance"
                                            name="barDistance"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            onChange={handleOnChange}
                                            value={inputs.barDistance}
                                        />



                                    </div>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <label htmlFor="date" className="">Min Seats</label>
                                        <input
                                            type={"number"}
                                            id="Seats"
                                            name="Seats"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            onChange={handleOnChange}
                                            value={inputs.Seats}
                                        />
                                    </div>

                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <label htmlFor="date" className="">London Only</label>
                                        <input
                                            type={"checkbox"}
                                            id="London"
                                            name="London"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            onChange={handleOnChange}
                                            checked={inputs.London}
                                        />
                                    </div>


                                    {barringVenues > 0 ?
                                        (
                                            <>
                                            </>
                                        ): (
                                            <>
                                        <div className="flex flex-row space-x-2 space-y-2">
                                            Display list
                                            for venues in venue list
                                        </div>
                                        </>
                                        )


                                    }


                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => closeForm()}
                                            // THis will not save anything and discard the form
                                        >

                                            Close and Discard
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="submit" > Get Venues
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