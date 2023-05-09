import * as React from "react";
import {
  faBook,
  faEdit,
  faPlus,
  faSquareXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const activitiy = [
  {
    tour: "C12233",
    title: "Grand Hall",
    type: "townsville",
    start: "England",
    end: "1592",
    followup: "20",
  },
];

const GlobalActivites = () => (
  <div className={"flex  w-full "}>
    <div className="flex-auto mx-4 mt-0overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <div className={"mb-1"}></div>
      <table className=" min-w-full divide-y divide-gray-300">
        <thead className=" text-white">
          <tr  className="bg-primary-green">
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 rounded-tl-md text-left text-sm font-semibold text-white sm:pl-6"
            >
              Tour
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
            >
              Activity Title
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white lg:table-cell"
            >
              Type
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell"
            >
              Start
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell"
            >
              end
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell"
            >
              Follow-up
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 rounded-tr-md text-left text-sm font-semibold text-white"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {activitiy.map((venue) => (
            <tr key={venue.tour}>
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-white sm:w-auto sm:max-w-none sm:pl-6">
                {venue.tour}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                {venue.title}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {venue.type}
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {venue.start}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">{venue.end}</td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {venue.followup}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">view</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          className={
            "inline-flex items-center mt-5 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          }
        >
          Add Activity{" "}
        </button>
      </div>
    </div>
  </div>
);

export default GlobalActivites;
