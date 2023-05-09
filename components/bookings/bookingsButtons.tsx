import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faArrowsLeftRightToLine,
  faCalendarXmark,
  faFileExcel,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { forceNavigate } from "../../utils/forceNavigate";
import addBooking from "./modal/AddTourBooking";
import AddTourBooking from "./modal/AddTourBooking";
import TourGapSugget from "./modal/tourGapSugget";

import { useEffect, useState } from "react";
import { userService } from "../../services/user.service";
import { Simulate } from "react-dom/test-utils";
import change = Simulate.change;
import TourJumpMenu from "../global/nav/TourJumpMenu";
import Holds from "./modal/hold";
import Report from "./modal/Report";
import Barring from "./modal/barring";
import BookingHold from "./modal/bookingHold";
import AddBooking from "./modal/AddBooking";

let show = "ST1"; // This needs to be passed from the template

/**
 * Jump menu navagaion jump to active tour
 *
 * @param e
 */
function changTour(e) {
  forceNavigate(`/bookings/${e.target.value}`);
}

/**
 * Handle the quick show change menu
 *
 * @param e location that page should navigate to based on the current showes list
 */

export default function BookingsButtons(TourId) {
  const [selectedTour, setSelectedTour] = useState(TourId.TourID);

  let selected = "";

  // @ts-ignore
  return (
    <>
      <div className="mt-1 mx-auto">
        <div className="flex justify-between">
          <AddBooking TourId={selectedTour}></AddBooking>
          <Report TourID={TourId}></Report>

          <button className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1">
            Bookings
          </button>
          <BookingHold TourId={TourId} TourID={undefined}></BookingHold>
          <button className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1">
            Run Barring Check
          </button>
          <button className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1">
            Remove Booking
          </button>
          <button className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1">
            Change Date
          </button>
          <button className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1 mr-8">
            Gap Suggestion
          </button>
        </div>
        <div className="col-auto">
          <div className="col-auto">
            <div className="flex flex-row">&nbsp;</div>
          </div>
        </div>
      </div>
    </>
  );
}
