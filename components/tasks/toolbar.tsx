import React, {SetStateAction, Dispatch} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faArrowsLeftRightToLine,
  faCalendarXmark,
  faFileExcel,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface ToolbarProps {
  openAddTask: (open: boolean) => void;
  searchFilter: string;
  setSearchFilter: Dispatch<SetStateAction<string>>
}

const Toolbar: React.FC<ToolbarProps> = ({searchFilter, setSearchFilter, openAddTask }) => {
  return (
    <div className=" px-2 flex flex-col w-screen-full">
      <div className='w-full flex flex-row justify-end'>
      <div className="flex flex-row">
        <select className="rounded-md border-none drop-shadow-md" name='filter' id='filter'>
            <option>
              Select Filter
            </option>
          </select>
        </div>

      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold mr-4 text-primary-purple">Tasks</h1>
        </div>
        <div className="flex flex-col items-center">
  <form className="mt-4 relative">
    <label htmlFor="searchBookings" className="sr-only">
      Search Tasks
    </label>
    <div className="relative">
      <input
        onChange={(e) => setSearchFilter(e.currentTarget.value)}
        value={searchFilter}
        className="border-none pl-8 pr-2 py-1 rounded-md"
        type="text"
        placeholder="Search Tasks"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
      </div>
    </div>
  </form>
</div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => openAddTask(true)}
          className="flex flex-row justify-center w-44 text-center rounded-md border-gray-300 drop-shadow-md bg-white px-3 py-2 text-xs font-medium text-primary-purple shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-4"
        >
          Add Task
        </button>
        <button className="flex flex-row justify-center w-44 text-center rounded-md border-gray-300 drop-shadow-md bg-white px-3 py-2 text-xs font-medium text-primary-purple shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add Recurring Task
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
