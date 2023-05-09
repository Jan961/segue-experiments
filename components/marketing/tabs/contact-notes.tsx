import * as React from "react";
import {
  faBook,
  faEdit,
  faPlus,
  faSquareXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const notes = [
  {
    who: "Jo Swanson",
    date: "10/10/2021",
    time: "17:30",
    actionby: "Peter Griffin",
    notes: "this was a long discussion bout stage lighting",
  },
];

const ContactNotes = () => (
  <div className={"flex w-9/12 "}>
    <div className="flex-auto mx-4 mt-0overflow-hidden   ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <div className={"mb-1"}></div>
      <table className=" ">
        <thead className="bg-primary-green">
          <tr>
            <th
              scope="col"
              className="w-2/12 py-1 rounded-tl-md   pl-4 pr-3 text-center text-sm font-normal border-l-white border text-white sm:pl-6"
            >
              Who
            </th>
            <th
              scope="col"
              className="w-2/12 py-1  pl-4 pr-3 text-center text-sm font-normal border-l-white border text-white sm:pl-6"
            >
              Date / Time
            </th>
            <th
              scope="col"
              className="w-1/12 hidden px-12 py-1  text-center text-sm font-normal border-l-white border text-white lg:table-cell"
            >
              Action By
            </th>

            <th
              scope="col"
              className="6/12 hidden px-3 py-1  text-center text-sm font-normal border-l-white border text-white sm:table-cell"
            >
              Notes
            </th>
            <th
              scope="col"
              className="px-3 py-1 rounded-tr-md text-center text-sm font-normal border-l-white border text-white"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {notes.map((note, idx) => (
            <tr
              key={note.who}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm border-l-gray-300 border font-medium text-gray-500 sm:w-auto sm:max-w-none sm:pl-6">
                {note.who}
              </td>
              <td className="hidden px-3 py-4 text-sm border-l-gray-300 border text-gray-500 lg:table-cell">
                {note.date} - {note.time}
              </td>
              <td className="hidden px-3 py-4 text-sm border-l-gray-300 border text-gray-500 sm:table-cell">
                {note.actionby}
              </td>
              <td className="hidden px-3 py-4 text-sm border-l-gray-300 border text-gray-500 sm:table-cell">
                {note.notes}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-900 mr-1"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="sr-only">Add</span>
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-900 mr-1"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span className="sr-only">Edit</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2">
        <button
          className={
            "inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          }
        >
          Add Note{" "}
        </button>
      </div>
    </div>
  </div>
);

export default ContactNotes;
