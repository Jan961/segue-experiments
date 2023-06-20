import Report from './modal/Report'
import BookingHold from './modal/bookingHold'
import Barring from './modal/barring'

interface BookingButtonsProps {
  selectedBooking: number
  currentTourId: number
}

export default function BookingsButtons ({ selectedBooking, currentTourId }: BookingButtonsProps) {
  return (
    <div className="mt-1 gap-2 mx-auto flex">
      <Report TourId={currentTourId}></Report>
      <BookingHold TourId={currentTourId} ></BookingHold>
      <Barring />
    </div>
  )
}
