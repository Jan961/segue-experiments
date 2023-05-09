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

let show = "ST1"; // This needs to be passed from the template
let tour = "22";

const Toolbar = ({ title = "This is the default title" }) => (
<div>
    <div className="flex flex-row items-center text-primary-green justify-evenly mt-5 h-50 max-w-full bg-transparent">
      <div className=" w-1/12">
        <button className={" w-100 bg-primary-green text-white rounded-md p-4 whitespace-nowrap"}>Add Activity</button>
      </div>

        <select>
          <option>Type</option>
        </select>
        <label htmlFor={"date"}>Date</label>
        <input type={"date"} />
        <label htmlFor={"date"}>TO</label>
        <input type={"date"} />
        <label htmlFor={"venue Code"}>Date</label>
        <input type={"text"} />
        <input type={"checkbox"} />
        <label className="text-center font-bold" htmlFor={"venue Code"}>
          Display current tour activities only
        </label>
    </div>
  </div>
);

export default Toolbar;
