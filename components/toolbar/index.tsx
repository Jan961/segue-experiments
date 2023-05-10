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
import TourJumpMenu from "../global/nav/TourJumpMenu";

// This needs to be passed from the template
// let show = "ST1"; 
// let tour = "22";

interface props {
  title: string;
  searchFilter?: string;
  setSearchFilter?: React.Dispatch<React.SetStateAction<string>>;
  color?: string;
  tourJump?: boolean;
  filterComponent?: any;
  setFiltersOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  filtersOpen?:boolean
}

const GlobalToolbar = ({
  title,
  searchFilter,
  tourJump = true,
  setSearchFilter,
  color = "text-primary-blue",
  filterComponent,
  filtersOpen=false,
  setFiltersOpen,
}: props) => {
  
  return(
  <div className="py-4">
    <div className="col-auto">
      <div className="flex flex-row align-center justify-between mx-8">
        {tourJump ? (
          <div className="bg-white drop-shadow-md rounded-md flex flex-row">
            <div className="rounded-l-md">
              <div className="flex items-center">
                <p className="mx-2">Set Tour</p>
                <TourJumpMenu></TourJumpMenu>
              </div>
            </div>
          </div>
        ) : (
          <div> </div>
        )}
        <div className="flex flex-row">
          {/* new  */}
          <div className="flex flex-row">
    <button
      className="border-gray-400 rounded-md drop-shadow-md px-2 py-1"
      onClick={() => setFiltersOpen(!filtersOpen)}
    >
      <span className="font-bold">Display Filters</span>
      <svg
        className="inline-block ml-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        width="20"
        height="20"
      >
        {filtersOpen ? 
          (<path d="M5 6l5 5 5-5H5z" />): (<path
            fillRule="evenodd"
            d="M5 8h10l-5 5-5-5zm0 0h10l-5 5-5-5z"
            clipRule="evenodd"
          />
        ) 
        }
      </svg>
    </button>
  </div>
          {/* new  */}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4 mx-8">
        <h1 className={`text-3xl font-bold ${color} `}>
          {title}
        </h1>

        <div className="flex flex-row">
          <div className="mt-4 relative">
            <label htmlFor="searchBookings" className="sr-only">
              Search Venues
            </label>
            <div className="relative">
              <input
                onChange={(e) => setSearchFilter(e.currentTarget.value)}
                value={searchFilter}
                className="border-none pl-8 pr-2 py-1 rounded-md"
                type="text"
                placeholder="Search Venues..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* @ts-ignore */}
      {filterComponent && filterComponent}
    </div>
  </div>
)}

export default GlobalToolbar;
