import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faArrowsLeftRightToLine,
  faCalendarXmark,
  faChevronRight,
  faFileExcel,
  faLocationDot,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { dateService } from "../../services/dateService";

import PerfomancesList from "./perfomancesList";
import {useEffect, useState} from "react";
import AddPerfomance from "./modal/AddPerfomance";

let today = new Date();

export default function BookingDetailsForm({BookingId}) {

  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    Date: null,
    Venue_Name:null,
    Capacity: 9999, Notes: undefined

  });



  useEffect(() => { (async() => {

    fetch(`/api/bookings/Performances/${BookingId}`)
        .then((res) => res.json())
        .then((data) => {
          alert("API Return" +  JSON.stringify(data))
          setInputs({
            Date: null,
            Venue_Name: "some Place",
            Capacity: 22222,
            Notes: BookingId
          })

        })



  })(); }, []);





  //
  function handleOnChange() {}

  return (
      <div className="w-6/12 p-4 border-4">
        <form>
          <div className="bg-primary-blue rounded-xl flex flex-col justify-center mb-4">
            <div className="flex flex-row mx-4 mt-3 mb-1">
              <label htmlFor="date" className=""></label>
              <input
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={inputs.Date}
                  id="Date"
                  name="Date"
                  type="date"
                  required
                  onChange={handleOnChange}
              />
            </div>
            <div className="flex flex-row mx-4 mb-3 mt-1">
              <label htmlFor="venueName" className=""></label>
              <input
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={inputs.Venue_Name}
                  id="Venue_Name"
                  name="Venue_Name"
                  type="text"
                  required
                  onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="flex flex-row h-10 items-center mb-4">
            <label
                htmlFor="Capacity"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            >
              Capacity:
            </label>

            <input
                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 mr-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-4/5"
                value={inputs.Capacity}
                id="Capacity"
                name="Capacity"
                type="text"
                required
                onChange={handleOnChange}
            />
            <button className="inline-flex items-center rounded-md border border-transparent bg-primary-blue px-8 py-1 text-xs font-normal leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-4/5">
              Change
            </button>
          </div>

          <div className="flex flex-row mb-4">
            <label
                htmlFor="dayTypeCast"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            >
              Day Type: (crew)
            </label>
            <select className="flex flex-auto h-4/5 rounded-l-md rounded-r-md text-xs">
              <option>Rehearsal</option>
              <option>Show</option>
              <option>Rest</option>
            </select>
          </div>
          <div className="flex flex-row mr-0">
            <label htmlFor="crewDetails" className="sr-only">
              crew Details
            </label>
            <input
                type="text"
                id="crewDetails"
                name="crewDetails"
                value="Scene, Port Glasgow"
                className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
            />
          </div>

          <div className="flex flex-row">
            <label
                htmlFor="dayTypecrew"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            >
              Day Type: (crew)
            </label>
            <select className="flex flex-auto m-3 h-4/5 rounded-l-md rounded-r-md text-xs mr-0">
              <option>Fit Up</option>
              <option>Show</option>
              <option>Rest</option>
            </select>
          </div>
          <div className="flex flex-row">
            <label htmlFor="crewDetails" className="sr-only">
              crew Details
            </label>
            <input
                type="text"
                id="crewDetails"
                name="crewDetails"
                value="Greenock Town Hall, Greenock"
                className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
            />
          </div>
          <div className="flex flex-row">
            <label
                htmlFor="venuStatus"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            >
              Venue Status:
            </label>
            <select className="flex flex-auto m-3 mb-1 mr-0 rounded-l-md rounded-r-md text-xs">
              <option>Confirmed</option>
              <option>Show</option>
              <option>Rest</option>
            </select>
          </div>
          <div className="flex flex-row">
            <label
                htmlFor="runDays"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            >
              Run Days:
            </label>
            <select className="flex flex-auto m-3 rounded-l-md rounded-r-md text-xs">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            <label
                htmlFor="venuStatus"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            >
              Pencil #:
            </label>
            <select className="flex flex-auto m-3 mr-0 rounded-l-md rounded-r-md text-xs">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div className="flex flex-row">
            <label
                htmlFor="notes"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            ></label>
            <textarea
                id="Notes"
                name="N"
                required
                className="flex-auto rounded-l-md rounded-r-md w-full mb-1"
                value={inputs.Notes}
            ></textarea>
          </div>

          <div className="flex flex-row justify-between">
            <button className="inline-flex items-center justify-center w-2/5 rounded-md border border-primary-blue bg-white px-2 py-2 text-xs font-medium leading-4 text-primary-blue shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 ml-0">
              Save
            </button>
            <button className="inline-flex items-center justify-center w-3/5 rounded-md border border-transparent bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 mr-0">
              Save & go to next
            </button>
          </div>

          <div className="flex flex-row">
            <label
                htmlFor="notes"
                className="flex-auto text-primary-blue font-bold text-sm self-center"
            >
              Performances:
            </label>
            <AddPerfomance BookingId={1}></AddPerfomance>

          </div>

          <div className="flex flex-row">
            <div className="col-auto">
              <div className="col-auto">
                <div className="flex flex-row">&nbsp;</div>
              </div>
            </div>
            <div className="w-full text-sm rounded-md border py-2">
              {/*  <PerfomancesList bookingId={1}></PerfomancesList> */}
            </div>
          </div>

          <div className="flex flex-row justify-between mt-4">
            <button className="inline-flex items-center justify-center w-2/5 rounded-full border border-transparent bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 ml-0">
              <span className="flex-grow">View Venue Info</span>
              <div className="bg-primary-blue border-2 border-white rounded-full w-5 h-5 text-white flex items-center justify-center">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </button>

            <button className="inline-flex items-center justify-center w-3/5 rounded-full border border-transparent bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 mr-0">
              <span className="flex-grow">View Booking History</span>
              <div className="bg-primary-blue border-2 border-white rounded-full w-5 h-5 text-white flex items-center justify-center">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </button>
          </div>

          <div className="flex flex-row mt-1">
            <p className="text-xs">Travel from previous venue: N/A</p>
          </div>
          <div className="flex flex-row">
            <p className="text-xs">Travel to next venue: 66 miles (1.21)</p>
          </div>
        </form>
      </div>
  );
}
