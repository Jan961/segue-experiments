import Report from './modal/Report'
import BookingHold from './modal/bookingHold'
import AddBooking from './modal/AddBooking'
import TourGapsModal from './modal/tourGapSugget'
import Barring from './modal/barring'

interface BookingButtonsProps {
  selectedBooking: number
  currentTourId: number
}

export default function BookingsButtons ({ selectedBooking, currentTourId }: BookingButtonsProps) {
  return (
    <div className="mt-1 mx-auto mb-2 flex justify-between">
      <AddBooking BookingId={selectedBooking}></AddBooking>
      <Report TourId={currentTourId}></Report>
      <BookingHold TourId={currentTourId} ></BookingHold>
      <Barring />
      <TourGapsModal TourId={currentTourId} ></TourGapsModal>
    </div>
  )
}
