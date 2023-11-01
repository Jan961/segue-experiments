import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

let show = 'ST1'; // This needs to be passed from the template
let tour = '22';

const Toolbar = () => (
  <div>
    <div className="columns-3 mt-3">
      <div className="col-auto">
        <div className="flex flex-row"></div>
        <div className="flex flex-row">
          <h1 className="text-2xl font-normal">Tasks</h1>
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
          <div className="flex flex-row ml-0">
            <button>
              <FontAwesomeIcon icon={faAnglesDown as IconProp} /> Display Filters
            </button>
          </div>
          <div className="flex flex-row">
            <form>
              <label htmlFor="searchBookings" className="sr-only">
                Search Bookings
              </label>
              <input className="border-2" type="search" placeholder="Search Bookings" />
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className="columns-3 mt-5 max-w-full bg-gray-200">
      <div className="">
        <button className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add Task
        </button>
        <button className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add Recurring Task
        </button>
      </div>

      <div></div>
    </div>
  </div>
);

export default Toolbar;
