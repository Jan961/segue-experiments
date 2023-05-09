import * as React from "react";
import Link from "next/link";

let tourId = 1;

const SideNavBar = (data?) => (
  <div className="1/12 w-60 h-full shadow-md bg-white px-1 ">
    <ul className="relative">
      <li className="relative">
        <a
          className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
          href="/bookings/FTM/22"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
        >
          Bookings
        </a>
      </li>
      <li className="relative">
        <a
          className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
          href="#"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
        >
          Marketing
        </a>
        <ul className="pl-5">
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/marketing"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Marketing Home
            </a>
          </li>
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/marketing/venue/status/"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Venue Data Status
            </a>
          </li>
          <li className="relative">
            <Link
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href={`/${data.Tour}/marketing/venue/status`}
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Venue History Entry
            </Link>
          </li>
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/marketing/sales/entry"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Sales Entry
            </a>
          </li>
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/marketing/sales/final"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Final Figures Entry
            </a>
          </li>
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/marketing/sales/history-load"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Load Sales History
            </a>
          </li>
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/marketing/activity/global"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Global Activities
            </a>
          </li>
        </ul>
      </li>
      <li className="relative">
        <a
          className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
          href="/contracts/2/19"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
        >
          Contracts
        </a>
      </li>
      <li className="relative">
        <a
          className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
          href="/reports"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
        >
          Reports
        </a>
      </li>
      <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/tasks/20"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Tasks
            </a>
          </li>
      <li className="relative">
        <a
          className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
          href="#!"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
        >
          Admin
        </a>
        <ul className="pl-5">
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/venues/20"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Venues
            </a>
          </li>
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/shows"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Shows
            </a>
          </li>
          <li className="relative">
            <a
              className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              href="/tours/1"
              data-mdb-ripple="true"
              data-mdb-ripple-color="dark"
            >
              Tours
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
);

export default SideNavBar;
