import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const show = 'ST1' // This needs to be passed from the template
const tour = '22'

interface props {
  title?: string;
  searchFilter?: string;
  setSearchFilter?: React.Dispatch<React.SetStateAction<string>>;
}

const Toolbar = ({ title, searchFilter, setSearchFilter }: props) => (
  <div className="py-4">
    <div className="col-auto">
      <div className="flex flex-row align-center justify-between">
        <div className="bg-white drop-shadow-md rounded-md flex flex-row">
          <div className="rounded-l-md">
            <div className="flex items-center">
              <p className="mx-2">Set Tour</p>
              <select className="text-primary-green border-y-0 border-r-0 border-l-1 border-gray-200 font-medium rounded-r-md">
                <option>
                  {show}/{tour}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-row">
          <select
            className="border-gray-400 rounded-md drop-shadow-md"
            name="filter"
            id="filter"
          >
            <option>Display Filters</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <h1 className="text-3xl font-bold text-primary-green ">
          {' '}
          {show} / {tour} {title}
        </h1>

        { setSearchFilter && (
          <div className="flex flex-row">
            <form className="mt-4 relative">
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
            </form>
          </div>
        )}
      </div>
    </div>

    <div className="col-auto">
      <div className="col-auto">
        <div className="flex flex-row">&nbsp;</div>
        <div className="flex flex-row">&nbsp;</div>
      </div>
    </div>

    <div className="col-auto">
      <div className="col-auto">
        <div className="flex flex-row">&nbsp;</div>
      </div>
    </div>
  </div>
)

export default Toolbar
