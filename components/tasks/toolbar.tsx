import React, {SetStateAction, Dispatch, useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faArrowsLeftRightToLine,
  faCalendarXmark,
  faFileExcel,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Tour } from "interfaces";
import { loggingService } from "services/loggingService";
import getUsers from "utils/getUsers";

interface ToolbarProps {
  openAddTask: (open: boolean) => void;
  openAddRecurringTask: (open: boolean) => void;
  searchFilter: string;
  setSearchFilter: Dispatch<SetStateAction<string>>;
  displayFilter?: boolean;
  assignedBy?:number
  setAssignedBy?:Dispatch<SetStateAction<number>>;
  assignee?:number
  setAssignee?:Dispatch<SetStateAction<number>>;
  selectedTour?:number;
  setSelectedTour?:any;
  tours:Tour[];
  userAccountId:number;
  filtersOpen:boolean;
}


const Toolbar: React.FC<ToolbarProps> = ({filtersOpen, openAddRecurringTask,userAccountId,tours, openAddTask, searchFilter, setSearchFilter, assignedBy, setAssignedBy, assignee, setAssignee, selectedTour, setSelectedTour }) => {
const [users, setUsers] = useState([])

  async function requestAccountUsers(){
    let foundUsers = await getUsers(userAccountId)
    console.log("The found users",foundUsers)
    loggingService.logAction("User Response",foundUsers)
    if(foundUsers){
      setUsers(foundUsers)
    }
  }

  useEffect(() => {
    requestAccountUsers()
  }, [])
  

  return (
    <div className=" pt-4 flex flex-col w-screen-full">
      <div className="flex items-center">
        <button
          onClick={() => openAddTask(true)}
          className="flex flex-row justify-center w-44 text-center rounded-md border-gray-300 drop-shadow-md bg-white px-3 py-2 text-xs font-medium text-primary-purple shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-4"
          >
          Add Task
        </button>
        <button
          onClick={() => openAddRecurringTask(true)}
         className="flex flex-row justify-center w-44 text-center rounded-md border-gray-300 drop-shadow-md bg-white px-3 py-2 text-xs font-medium text-primary-purple shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add Recurring Task
        </button>


      <div className={`${!filtersOpen && "hidden"} transition-all duration-100 flex flex-row items-center justify-evenly text-primary-purple w-full bg-transparent`}>


        <label className=" sr-only" htmlFor={"date"}>Title</label>
        <input placeholder="title..."  value={searchFilter} onChange={(e)=>setSearchFilter(e.currentTarget.value)} className="rounded-md border-none drop-shadow-md" type={"text"} />
        <select className="rounded-md border-none drop-shadow-md" onChange={(e) => setAssignee(parseInt(e.currentTarget.value))} id={"assignee"} >
          <option value={0}>Assignee</option>
          {users.map(usr => {
                   return <option value={usr.UserId}>{usr.UserName}</option>
                  })} 
        </select>
        <select className="rounded-md border-none drop-shadow-md" id={"assignedBy"} onChange={(e) => setAssignedBy(parseInt(e.currentTarget.value))} >
          <option value={0}>Assigned by</option>
          {users.map(usr => {
                   return <option value={usr.UserId}>{usr.UserName}</option>
                  })} 
        </select>
        <label className=" sr-only" htmlFor={"assignedBy"}>Assigned By</label>
        <select className="rounded-md border-none drop-shadow-md" id={"tourSelect"} onChange={(e) => setSelectedTour(parseInt(e.currentTarget.value))} >
          <option value={0}>Select a Tour</option>
          {tours.length > 0 && tours.map((tour) => (
            <option key={tour.TourId} value={tour.TourId} >{tour.Show.Code}/{tour.Code}</option>
        ))
        }        </select>
        <label className=" sr-only" htmlFor={"tourSelect"}>Tour</label>

    </div>
    </div>
  </div>
  );
};

export default Toolbar;
