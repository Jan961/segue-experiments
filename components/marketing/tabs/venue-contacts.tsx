import * as React from "react";
import {
  faBook,
  faEdit,
  faPlus,
  faSearch,
  faSquareXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const people = [
  {
    role: "Stage Manager",
    firstname: "Jo",
    lastname: "Swanson",
    phone: "0141 000 0001",
    email: "jo.swanson@theaster.co.uk",
  },
  {
    role: "Lighting Manager",
    firstname: "Sam",
    lastname: "Smith",
    phone: "0141 000 0002",
    email: "sam.smith@theaster.co.uk",
  },
  {
    role: "Back of House Manager",
    firstname: "Tom",
    lastname: "Scott",
    phone: "0141 000 0003",
    email: "tom.scott@theaster.co.uk",
  },
];

const Activities = () => (
  <div className={"flex w-9/12"}>
    <div className="flex-auto mx-4 mt-0overflow-hidden   ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <div className={"mb-4"}>
        <div className="flex flex-row justify-between items-center">
          <label htmlFor={"onSale"} className={"font-bold text-primary-green"}>
            Venue Contact
          </label>
   
            <div className="relative">
              <input
                // onChange={(e) => setSearchFilter(e.currentTarget.value)}
                // value={searchFilter}
                className="border border-gray-200 pl-8 pr-2 py-1 rounded-md"
                type="text"
                placeholder="Search Venues..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <table className=" min-w-full ">
        <thead className="bg-gray-50">
          <tr className="bg-primary-green">
            <th
              scope="col"
              className="py-1 pl-4 pr-3 rounded-tl-md text-center text-sm font-normal border-l-white border-l text-white sm:pl-6"
            >
              Role
            </th>
            <th
              scope="col"
              className="py-1 pl-4 pr-3 text-center text-sm font-normal border-l-white border-l text-white sm:pl-6"
            >
              First Name
            </th>
            <th
              scope="col"
              className="hidden px-3 py-1 text-center text-sm font-normal border-l-white border-l text-white lg:table-cell"
            >
              Last Name
            </th>
            <th
              scope="col"
              className="hidden px-3 py-1 text-center text-sm font-normal border-l-white border-l text-white sm:table-cell"
            >
              Phone
            </th>
            <th
              scope="col"
              className="hidden px-3 py-1 text-center rounded-tr-md text-sm font-normal border-l-white border-l text-white sm:table-cell"
            >
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {people.map((person, idx) => (
            <tr
              key={person.role}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border-r border-r-gray-300 w-full max-w-0 py-3 px-3 text-sm font-medium text-gray-500 sm:w-auto sm:max-w-none sm:pl-6">
                {person.role}
              </td>
              <td className="border-r border-r-gray-300 hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                {person.firstname}{" "}
              </td>
              <td className="border-r border-r-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {person.lastname}
              </td>
              <td className="border-r border-r-gray-300 hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                {person.phone}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <a href={"mailto:" + person.email}>{person.email}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <button
          className={
            "inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          }
        >
          Add another contact{" "}
        </button>
      </div>
    </div>
  </div>
);

export default Activities;
