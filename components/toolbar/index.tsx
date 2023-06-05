import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import TourJumpMenu from '../global/nav/TourJumpMenu'
import { FormInputText } from 'components/global/forms/FormInputText';

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
}

const GlobalToolbar = ({
  title,
  searchFilter,
  tourJump = true,
  setSearchFilter,
  color = 'text-primary-blue',
  filterComponent
}: props) => {
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  return (
    <div className="py-2 flex flex-row items-center gap-4">
      { filterComponent && (
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
              {filtersOpen
                ? (<path d="M5 6l5 5 5-5H5z" />)
                : (<path
                  fillRule="evenodd"
                  d="M5 8h10l-5 5-5-5zm0 0h10l-5 5-5-5z"
                  clipRule="evenodd"
                />
                )
              }
            </svg>
          </button>
        </div>
      )}
      {tourJump
        ? (
          <div className="bg-white drop-shadow-md inline-block rounded-md">
            <div className="rounded-l-md">
              <div className="flex items-center">
                <p className="mx-2">Set Tour</p>
                <TourJumpMenu></TourJumpMenu>
              </div>
            </div>
          </div>
        )
        : (
          <div> </div>
        )}
      <h1 className={`text-xl font-bold ${color} `}>
        {title}
      </h1>
      <div className="ml-auto">
        <label htmlFor="searchBookings" className="sr-only">
            Search Venues
        </label>
        <div className="relative">
          <FormInputText
            name="Search"
            onChange={(e) => setSearchFilter(e.currentTarget.value)}
            value={searchFilter}
            placeholder="Search Venues..."
            className="mb-0"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
        </div>
      </div>
      {/* @ts-ignore */}
      {filterComponent && filterComponent}
    </div>
  )
}

export default GlobalToolbar
