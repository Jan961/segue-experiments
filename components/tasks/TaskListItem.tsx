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
import { ITourTask } from "interfaces";
import formatDate from "utils/formatDate";
import getTaskDateStatusColor from "utils/getTaskDateStatus";
import formatDateDoubleDigits from "utils/formatDateDoubleDigits";



function getPriority(priority){

  switch (priority) {
    case 0:
      return "low"
      break;
    case 1:
      return "Medium"
      break;
    case 2:
      return "High"
      break;
  
    default:
      break;
  }
}
const TaskListItem = ({
  task,
  handleSelectedFunction,
  isTaskSelected,
  openUpdateModal,
}: {
  openUpdateModal: (task:ITourTask) => void;
  task: ITourTask;
  isTaskSelected: (taskId: any) => boolean;
  handleSelectedFunction: (taskId: any) => void;
}) => { 

  const taskDateStatusColor = getTaskDateStatusColor(task.DueDate)
  
  return(

  <tr className={``}>
    
    <td className="relative w-12 px-6 sm:w-16 sm:px-8">

      <input
        onChange={() => handleSelectedFunction(task.TourTaskId)}
        checked={isTaskSelected(task.TourTaskId)}
        type="checkbox"
        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
        />
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap pr-3 text-sm font-medium text-gray-900 px-1`}
      >
      <select className="border-none rounded-md ">
        <option>-10</option>
      </select>
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap pr-3 text-sm font-medium text-gray-900`}
      >
      {formatDateDoubleDigits(task.DueDate) ?? "-"}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap pr-3 text-sm font-medium text-gray-900`}
      >
 <select className="border-none rounded-md ">
        <option>-10</option>
      </select>    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap pr-3 text-sm font-medium text-gray-900`}
      >
      {formatDateDoubleDigits(task.DueDate) ?? "-"}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap px-3 text-sm text-gray-500`}
      >
      {task.Progress + "%"}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap px-3 text-sm text-gray-500`}
      >
      {task.TaskName}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap px-3 text-sm text-gray-500`}
      >
      {task.User_TourTask_AssignedByToUser.UserName}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap px-3 text-sm text-gray-500`}
      >
      {task.User_TourTask_AssigneeToUser.UserName}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap px-3 text-sm text-gray-500`}
      >
      {task.Status}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap px-3 text-sm text-gray-500`}
      >
      {getPriority(task.Priority)}
    </td>
    <td
      onClick={() => openUpdateModal(task)}
      className={`cursor-pointer ${taskDateStatusColor} my-12 whitespace-nowrap px-3 text-sm text-gray-500`}
      >
      {formatDate(task.FollowUp) ?? "-"}
    </td>
  </tr>
)};

export default TaskListItem;
