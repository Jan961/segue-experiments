import * as React from "react";
import { forceNavigate } from "../../utils/forceNavigate";
import { useEffect, useState } from "react";
import Report from "./modal/Report";
import BookingHold from "./modal/bookingHold";
import AddBooking from "./modal/AddBooking";
import TourGapsModal from "./modal/tourGapSugget";
import RemoveBooking from "./modal/RemoveBooking";
import ChangeBookingDate from "./modal/ChangeBookingDate";
import Barring from "./modal/barring";



export default function BookingsButtons({selectedBooking, currentTourId}) {
  const [TourId, setTourId] = useState(selectedBooking.TourId);
  // @ts-ignore
  return (
    <>
      <div className="mt-1 mx-auto">
        <div className="flex justify-between">
            <AddBooking BookingId={selectedBooking}></AddBooking>
           <Report TourId={currentTourId}></Report>
          <button className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1">
            Bookings
          </button>
          <BookingHold TourId={currentTourId} ></BookingHold>
         <Barring></Barring>

          <RemoveBooking BookingId={selectedBooking}></RemoveBooking>
          <ChangeBookingDate BookingId={selectedBooking} currentTourId={currentTourId}></ChangeBookingDate>
          <TourGapsModal  TourId={currentTourId} ></TourGapsModal>
        </div>
        <div className="col-auto">
          <div className="col-auto">
            <div className="flex flex-row">&nbsp;</div>
          </div>
        </div>
      </div>
    </>
  );
}
