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
import { User } from "../../../interfaces";
import NewUser from "../forms/newUser";
import EditUser from "../forms/editUser";
import DeleteUser from "../forms/deleteUser";

type Props = {
  data: User;
};

// @ts-ignore
// @ts-ignore
const UserListItem = ({ data }: Props) => (
    <tr>
      <td className="whitespace-nowrap py-4 pr-3 text-sm text-gray-900 pl-4 border-r border-1 border-soft-table-row-separation">
        {data.UserName}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 pl-4 border-r border-1 border-soft-table-row-separation">
        {data.emailAddress}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 pl-4 flex items-center justify-between">
        <span className="mr-2">TODO | All shows | All Reports</span>
        <div className="flex justify-end">
          {/* {data.UserId}
          <EditUser UserId={data.UserId}></EditUser> */}
          <DeleteUser UserId={data.UserId}></DeleteUser>
        </div>
      </td>
    </tr>
  );

  

export default UserListItem;
