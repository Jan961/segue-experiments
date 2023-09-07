import BookingSchedule from './modal/BookingSchedule'
import Report from './modal/Report'
import Barring from './modal/barring'

interface BookingButtonsProps {
  currentTourId: number
}

export default function BookingsButtons ({ currentTourId }: BookingButtonsProps) {
  return (
    <>
      <Report TourId={currentTourId}></Report>
      <Barring />
      <BookingSchedule TourId={currentTourId} />
    </>
  )
}
