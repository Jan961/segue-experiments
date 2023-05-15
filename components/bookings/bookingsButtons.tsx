import { useState } from 'react'
import Report from './modal/Report'
import BookingHold from './modal/bookingHold'
import AddBooking from './modal/AddBooking'
import TourGapsModal from './modal/tourGapSugget'
import RemoveBooking from './modal/RemoveBooking'
import ChangeBookingDate from './modal/ChangeBookingDate'
import Barring from './modal/barring'

export default function BookingsButtons ({ selectedBooking, currentTourId }) {
  const [TourId, setTourId] = useState(selectedBooking.TourId)
  // @ts-ignore
  return (
    <>
      <div className="mt-1 mx-auto">
        <div className="flex justify-between">
          <AddBooking BookingId={selectedBooking}></AddBooking>
          <Report TourId={currentTourId}></Report>
          <BookingHold TourId={currentTourId} ></BookingHold>
          <Barring />
          <RemoveBooking BookingId={selectedBooking}></RemoveBooking>
          <ChangeBookingDate BookingId={selectedBooking} currentTourId={currentTourId}></ChangeBookingDate>
          <TourGapsModal TourId={currentTourId} ></TourGapsModal>
        </div>
        <div className="col-auto">
          <div className="col-auto">
            <div className="flex flex-row">&nbsp;</div>
          </div>
        </div>
      </div>
    </>
  )
}
