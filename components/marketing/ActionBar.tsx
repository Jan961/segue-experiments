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
import Salesreport from "./reports/salesreport";
import { useEffect, useState } from "react";
import { userService } from "services/user.service";
import { formatDateUK, getWeekDay } from "services/dateService";
import Tours from "pages/tours/[ShowId]";

let show = "ST1"; // This needs to be passed from the template
let tourId = "19";
let venue = "www.kingstheatreglasgow.net";
let landingPave = "www.kingstheatreglasgow.net/sleeping-beauty";

const ActionBar = ({ onActionBookingIdChange, onActiveToursChange }) => {
  const [activeTours, setActiveTours] = useState([]);
  const [inputs, setInputs] = useState({
    DateFrom: null,
    DateTo: null,
    Tour: null,
    Venue: null,
    Selection: null,
    BookingId: null,
    ShowDate: null,
  });

  const handleBookingIdChange = (e) => {
    const newActionBookingId = e.target.value;
    onActionBookingIdChange(newActionBookingId);
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/bookings/saleable/${tourId}`);
      const data = await response.json();
      setActiveTours(data);
      // Call the passed callback function
      onActiveToursChange(data);
    })();
  }, [tourId]);  

  async function handleOnChange(e) {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));

    if (e.target.name === "Tour") {
      // Load BookingId, ShowDate, Venue, and Tour for this tour
      const response = await fetch(`/api/bookings/saleable/19`);

      const data = await response.json();
      setInputs((prev) => ({
        ...prev,
        BookingId: data.BookingId,
        ShowDate: data.ShowDate,
        Venue: data.Venue,
        Tour: data.Tour,
      }));
      onActionBookingIdChange(data.BookingId);
    }
  }

  return (
    <div className="grid grid-cols-6 gap-3 mt-5 max-w-full items-center">
      <div className="col-span-2 flex space-x-2">
        <a
          className="px-2 text-primary-green whitespace-pre hover:text-white bg-transparent hover:bg-primary-green transition-all duration-75 cursor-pointer py-2  border border-primary-green rounded-md"
          href={`http://${venue}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {venue}
        </a>
        <a
          className="px-2 text-primary-green whitespace-pre hover:text-white bg-transparent hover:bg-primary-green transition-all duration-75 cursor-pointer py-2  border border-primary-green rounded-md"
          href={`http://${landingPave}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Landing Page
        </a>
      </div>
      <div className="col-span-4">
        <div className="grid grid-cols-5 gap-3">
          <button
            className={
              "col-span-1 items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center"
            }
          >
            Go To Today
          </button>
          <button
            className={
              "col-span-1 items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center"
            }
          >
            Previous Date
          </button>
          <button
            className={
              "col-span-1 items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center"
            }
          >
            Next Date
          </button>
          <div className="col-span-2">
            <select
              className="col-span-2 appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={inputs.Tour}
              id="Tour"
              name="Tour"
              onChange={(e) => {
                const actionBookingId = e.target.value;
                setInputs((prev) => ({ ...prev, BookingId: actionBookingId }));
                onActionBookingIdChange(actionBookingId); // Call the callback function
              }}
            >
              {activeTours.map((tour) => {
                const date = new Date(tour.ShowDate);
                const weekday = getWeekDay(date);
                const ukDate = formatDateUK(date);
                return (
                  <option key={tour.BookingId} value={`${tour.BookingId}`}>
                    {weekday} {ukDate} {tour.Venue.Name} | {tour.Tour.Show.Code}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      {/* SALES REPORT DOES NOT EXIST IN THE DESIGNS */}
      {/* <div>
            <Salesreport />
          </div> */}
    </div>
  );
};
export default ActionBar;

// Add default props
ActionBar.defaultProps = {
  onActionBookingIdChange: () => {},
};

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
