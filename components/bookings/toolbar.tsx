import * as React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAnglesDown,
    faArrowsLeftRightToLine,
    faCalendarXmark,
    faFileExcel,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {forceNavigate} from "../../utils/forceNavigate";
import addBooking from "./modal/AddTourBooking";
import AddTourBooking from "./modal/AddTourBooking";
import TourGapSugget from "./modal/tourGapSugget";

import {useEffect, useState} from "react";
import {userService} from "../../services/user.service";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;
import TourJumpMenu from "../global/nav/TourJumpMenu";
import Holds from "./modal/hold";
import Report from './modal/Report';
import Barring from './modal/barring';
import BookingHold from "./modal/bookingHold";


let show = "ST1"; // This needs to be passed from the template


/**
 * Jump menu navagaion jump to active tour
 *
 * @param e
 */
function changTour(e){

    forceNavigate(`/bookings/${e.target.value}`)
}

/**
 * Handle the quick show change menu
 *
 * @param e location that page should navigate to based on the current showes list
 */


export default function Toolbar(TourId) {


    const [selectedTour, setSelectedTour] = useState(TourId.TourID)

    let selected = ""


        // @ts-ignore
    return (
        <>
        <div>

            <div className="columns-3 mt-3">
                <div className="col-auto">
                   <TourJumpMenu></TourJumpMenu>
                    <div className="flex flex-row">
                        <h1 className="text-2xl font-normal"> {selected} Bookings</h1>
                    </div>
                </div>

                <div className="col-auto">
                    <div className="col-auto">
                        <div className="flex flex-row">
                            &nbsp;
                        </div>
                        <div className="flex flex-row">
                            &nbsp;
                        </div>
                    </div>
                </div>

                <div className="col-auto">
                    <div className="col-auto">
                        <div className="flex flex-row ml-0">
                            <button>
                                <FontAwesomeIcon icon={faAnglesDown as IconProp}/> Display Filters
                            </button>

                        </div>
                        <div className="flex flex-row">
                            <form>
                                <label htmlFor="searchBookings" className="sr-only">Search Bookings</label>
                                <input className="border-2" type="search" placeholder="Search Bookings"/>
                            </form>
                        </div>
                    </div>
                </div>


            </div>
            <div className="columns-3 mt-5 max-w-full bg-gray-200">
                <div className="">
                    <AddTourBooking></AddTourBooking>

                    <Report TourID={TourId}></Report>
                </div>

                <div>
                    <Barring></Barring>
                    <BookingHold  TourId={TourId}></BookingHold>
                    <button
                        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <FontAwesomeIcon icon={faCalendarXmark as IconProp}/> Change Date
                    </button>

                    <TourGapSugget data={selectedTour}></TourGapSugget>
                    <Holds></Holds>

                </div>
            </div>
        </div>
        </>
    )
}
