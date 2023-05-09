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

let show = "ST1"; // This needs to be passed from the template
let tour = "22";

const Toolbar = () => (
  <div className="mt-4 px-4">
      <div className="flex flex-row w-full justify-between" >
        <div className="bg-white drop-shadow-md flex h-full flex-row justify-center align-center rounded-md">
          
          <div className="border-gray-300 rounded-l-md h-full">
            <span className="align-middle">Set Tour</span>
            </div>
          <select className="text-primary-green border-gray-300 rounded-r-md">
            <option>
              {show}/{tour}
            </option>
          </select>
        </div>
        <div className="flex flex-row">
        <select className="rounded-md drop-shadow-md" name='filter' id='filter'>
            <option>
              Select Filter
            </option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-row w-full align-center justify-between" >
        <div className="inline-block">
          <h1 className="text-2xl align-middle text-primary-blue font-bold">
            {" "}
            {show} / {tour} Reports
          </h1>
        </div>

          <div className="flex flex-row">
            <form>
              <label htmlFor="searchBookings" className="sr-only">
                Search reports
              </label>
              <input
                className="border-none rounded-md"
                type="search"
                placeholder="Search reports"
              />
            </form>
          </div>

      </div>

      <div>
        <div className="col-auto">
          <div className="flex flex-row">&nbsp;</div>
          <div className="flex flex-row">&nbsp;</div>
        </div>
      </div>

      <div className="col-auto">
        <div className="col-auto">
          <div className="flex flex-row ml-0">&nbsp;</div>
        </div>
      </div>

  </div>
);

export default Toolbar;
