import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAnglesDown,
  faArrowsLeftRightToLine,
  faCalendarXmark,
  faFileExcel,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const show = 'ST1'; // This needs to be passed from the template
const tour = '22';

const Toolbar = () => (
  <div className="px-4">
    <div className="col-auto">
      <div className="flex flex-row align-center justify-between">
        <div className="bg-white rounded-md flex flex-row">
          <div className="rounded-l-md">
            <p>Set Tour</p>
          </div>
          <select className="text-primary-pink font-medium rounded-r-md">
            <option>
              {show}/{tour}
            </option>
          </select>
        </div>

        <div className="flex flex-row">
          <select className="rounded-md drop-shadow-md" name="filter" id="filter">
            <option>Select Filter</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <h1 className="text-2xl font-bold text-primary-pink ">
          {' '}
          {show} / {tour} Contracts
        </h1>

        <div className="flex flex-row">
          <form className="mt-4 relative">
            <label htmlFor="searchBookings" className="sr-only">
              Search Tasks
            </label>
            <div className="relative">
              <input
                // onChange={(e) => setSearchFilter(e.currentTarget.value)}
                // value={searchFilter}
                className="border-none pl-8 pr-2 py-1 rounded-md"
                type="text"
                placeholder="Search Bookings"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
            </div>
          </form>
        </div>
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
);

export default Toolbar;
