import * as React from "react";
import userListItem from "./userListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faArrowsLeftRightToLine,
  faCalendarXmark,
  faFileExcel,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import TaskListItem from "../../tasks/TaskListItem";
import UserListItem from "./userListItem";
import { useEffect, useState } from "react";
import AddUser from "../../../pages/accounts/manage-users/addUser";
import NewUser from "../forms/newUser";
import { Show, User } from "../../../interfaces";
import { userService } from "services/user.service";

/**
 *
 *  Get a list of each show or this account
 *
 */

const tabs = [
  { name: "Show A", href: "#", current: false },
  { name: "Show B", href: "#", current: false },
  { name: "Show C", href: "#", current: true },

  /**
   *  This may need appemded
   */
  { name: "Global", href: "#", current: false },
];

const permissions = [
  { id: 1, name: "Bookings", checked: true, subid: 0 },
  { id: 2, name: "All Reports", checked: false, subid: 0 },
  { id: 3, name: "Report A", checked: false, subid: 2 },
  { id: 4, name: "Report B", checked: false, subid: 2 },
  { id: 5, name: "Report C", checked: false, subid: 2 },
  { id: 6, name: "Report D", checked: false, subid: 2 },
  { id: 7, name: "Marketing", checked: false, subid: 0 },
  { id: 8, name: "Marketing Home", checked: false, subid: 7 },
  { id: 9, name: "Venue Data Status", checked: false, subid: 7 },
  { id: 10, name: "Sales Entry", checked: false, subid: 7 },
  { id: 11, name: "Final Figures Entry", checked: false, subid: 7 },
  { id: 12, name: "Load Sales History", checked: false, subid: 7 },
  { id: 13, name: "Global Activities", checked: false, subid: 7 },
  { id: 14, name: "Contracts", checked: false, subid: 0 },
  { id: 15, name: "Holds/Allocations", checked: false, subid: 0 },
  { id: 16, name: "All Admin", checked: false, subid: 0 },
  { id: 17, name: "Venues", checked: false, subid: 16 },
  { id: 18, name: "Show Data", checked: false, subid: 16 },
  { id: 19, name: "Tour Data", checked: false, subid: 16 },
  { id: 20, name: "Other", checked: false, subid: 0 },
  { id: 21, name: "Manage Users", checked: false, subid: 20 },
  { id: 22, name: "Manage Tout Settings", checked: false, subid: 21 },
];

const searchEndpoint = (accountId) =>
  `/api/account/read/users/accountUsers/${accountId}}`;
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const UserList = () => {
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [accountId, setAccountId] = useState(userService.userValue.accountId);

  let licences = 9; // This needs to be passed from the template
  let usedLicences = 8;

  function users() {
    fetch(searchEndpoint(accountId))
      .then((res) => res.json())
      .then((res) => {
        setResults(res.searchResults);
      });
  }

  useEffect(() => {}, []);

  //Page load - users will always be at lease 1 ( Account must have an owner)
  if (results.length === 0) {
    users();
  }

  return (
    <div className="mt-8 flex flex-col ml-10 mr-5">
      <div className="pb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your users</h2>
      </div>
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full table-fixed divide-y divide-gray-300 [&>tbody>*:nth-child(odd)]:bg-white [&>tbody>*:nth-child(even)]:bg-table-row-alternating">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="border-r border-white border-1 bg-primary-orange text-white text-center min-w-[12rem] py-2 pr-3 text-left text-sm font-normal text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="border-r border-white border-1 bg-primary-orange text-white text-center min-w-[12rem] py-2 pr-3 text-left text-sm font-normal text-gray-900"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="bg-primary-orange text-white text-center px-3 py-2 text-left text-sm font-normal text-gray-900"
                  >
                    Capabilities
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((user) => (
                  <UserListItem data={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <NewUser></NewUser>
    </div>
  );
};

export default UserList;
