import Report from './modal/Report'
import BookingHold from './modal/bookingHold'
import Barring from './modal/barring'

interface BookingButtonsProps {
  selectedBooking: number
  currentTourId: number
}

export default function BookingsButtons ({ selectedBooking, currentTourId }: BookingButtonsProps) {
  return (
    <>
      <Report TourId={currentTourId}></Report>
      <BookingHold TourId={currentTourId} ></BookingHold>
      <Barring />
    </>
  )
}
