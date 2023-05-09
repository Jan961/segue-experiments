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
import { IBooking } from "types/BookingTypes";

const weekday = ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"];
let today = "ST1"; // This needs to be passed from the template
let dateBooing = new Date("October 10, 2023");

function gotoToday() {
  return undefined;
}

function selectDay(showDate) {
  let newDate = new Date(showDate);
  return newDate.getDay();
}
function formatDate(showDate) {
  let newDate = new Date(showDate);
  return newDate.toLocaleDateString();
}

function getDayType(booking) {
  if (booking.Performance1Time || booking.Performance2Time) {
    return "Performance";
  }
  if (booking.RehearsalTown) {
    return "Rehearsal";
  }
  return "-";
}

const BookingDetailsListingPanel = ({
  tourData,
  setActiveContractIndex,
  activeContractIndex
}: {
  tourData: IBooking[] | [];
  activeContractIndex:number;
  setActiveContractIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  function handleContractChange(index) {
    setActiveContractIndex(index);
  }

  return (
    <div className="flex-col w-4/12 max-h-screen overflow-y-scroll">
    <h1 className="text-primary-pink mb-6">Week</h1>
      {tourData.length > 0 ? (
        tourData.map((booking, idx) => {
          return (
            <div
              onClick={() => handleContractChange(idx)}
              key={idx + "" + booking.BookingId}
              className={`w-100 p-4 border-y-1 border-gray-300  max-h-20 ${
                idx%2===0
                  ? "bg-none hover:bg-gray-100"
                  : "bg-slate-200 hover:bg-slate-300"
              }
                    cursor-pointer `}
            >
            <div
              onClick={() => handleContractChange(idx)}
              key={idx + "" + booking.BookingId}
              className={`w-100 p-4 border-y-1 border-gray-300  max-h-20 ${
                idx===activeContractIndex
                  && "bg-primary-pink rounded-md text-white"
                  
              }
                    cursor-pointer `}
            >
              <div className="flex flex-row justify-between ">
                <div className="">-1</div>
                <div className="">{weekday[selectDay(booking.ShowDate)]}</div>
                <div className="">
                  {booking.ShowDate && formatDate(booking.ShowDate)}
                </div>
                <div className="capitalize">{getDayType(booking)}</div>
                <div className=""></div>
              </div>
            </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};
export default BookingDetailsListingPanel;
