import { dateService } from 'services/dateService'

interface BookingDetailRowProps {
  booking: any,
  onClick: () => void,
  selected: boolean;
}

export const BookingDetailRow = ({ booking, onClick, selected }: BookingDetailRowProps) => {
  if (!booking) return null
  const ShowDate = dateService.dateToSimple(booking.FirstDate)
  const day = dateService.getWeekDay(booking.FirstDate)

  /*
  const week = dateService.weeks(
    booking.Tour.TourStartDate,
    booking.ShowDate
  )
  */

  let rowClass = 'grid gap-1 grid-cols-10 py-3 w-full border-l-4 border-transparent'
  if (selected) rowClass += ' bg-blue-200 border-blue-500'

  return (
    <button onClick={onClick} className="even:bg-gray-100 border-b border-gray-300">

      <div className={rowClass}>
        <div className="font-bold text-soft-primary-grey col-span-1 max-w-[50px]">
          ?
        </div>
        <div className="col-span-3 font-medium text-soft-primary-grey max-w-[150px]">
          {day}<br />{ShowDate}
        </div>
        <div className="flex flex-col col-start-5 col-end-11"> {/* Added col-start-5 and col-end-11 */}
          <div className="capitalize font-medium flex">
            {booking.DateType.Name}
          </div>
          {booking.Venue != null
            ? (
              <div className="flex flex-col">
                <div className="font-medium mb-1 flex">
                  {booking.Venue.Name} { booking.Venue.Town ? booking.Venue.Town : '' }
                </div>
                <div className="flex flex-wrap items-center space-x-4"> {/* Changed flex-row to flex-wrap and added space-x-4 */}
                  <div>Seats: {booking.Venue.Seats}</div>
                  <span>|</span>
                  <div>
                  Performances: {booking.PerformancesPerDay}
                  </div>
                  <span>|</span>
                  <div>Miles: 144</div>
                  <span>|</span>
                  <div>Time: 1:22</div>
                </div>
              </div>
            )
            : (
              <div></div>
            )}
        </div>

        <div>{/* booking details */}</div>
      </div>
    </button>
  )
}

export default BookingDetailRow
