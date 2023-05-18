import { useState } from 'react'
import Report from './modal/Report'
import BookingHold from './modal/bookingHold'
import AddBooking from './modal/AddBooking'
import TourGapsModal from './modal/tourGapSugget'
import RemoveBooking from './modal/RemoveBooking'
import Barring from './modal/barring'

interface BookingButtonsProps {
  selectedBooking: number
  currentTourId: number
}

export default function BookingsButtons ({ selectedBooking, currentTourId }: BookingButtonsProps) {
  // @ts-ignore
  return (
    <>
      <div className="mt-1 mx-auto">
        <div className="flex justify-between">
          <AddBooking BookingId={selectedBooking}></AddBooking>
          <Report TourId={currentTourId}></Report>
          <BookingHold TourId={currentTourId} ></BookingHold>
          <Barring />
          <RemoveBooking bookingId={selectedBooking}></RemoveBooking>
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
