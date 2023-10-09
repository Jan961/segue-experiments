import { useMemo } from 'react'
import { ToolbarButton } from 'components/bookings/ToolbarButton'
import moment from 'moment'
import { useRecoilState } from 'recoil'
import { formatDateUK, getWeekDay } from 'services/dateService'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import Typeahead from 'components/Typeahead'

const ActionBar = () => {
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState)
  const bookingOptions = useMemo(() => bookingJump.bookings
    ? bookingJump.bookings.map((b) => {
      const date = new Date(b.Date)
      const weekday = getWeekDay(date)
      const ukDate = formatDateUK(date)
      return { text: `${b.Venue.Code} ${b.Venue.Name} ${weekday} ${ukDate} (${b.StatusCode})`, value: `${b.Id}`, date: ukDate }
    })
    : [], [bookingJump])

  const selectedBookingIndex = useMemo(() => bookingOptions.findIndex(booking => parseInt(booking.value, 10) === bookingJump.selected), [bookingJump.selected, bookingOptions])
  const changeBooking = (e) => {
    const selected = Number(e.target.value) || null
    setBookingJump({ ...bookingJump, selected })
  }

  const goToToday = () => {
    const currentDate = moment()
    const sortedBookings = bookingOptions.sort((a, b) => {
      const distA = Math.abs(currentDate.diff(moment(a.date, 'DD/MM/YYYY'), 'days'))
      const distB = Math.abs(currentDate.diff(moment(b.date, 'DD/MM/YYYY'), 'days'))
      return distA - distB
    })
    const closestDateBooking = sortedBookings[0]
    const selected = Number(closestDateBooking.value)
    setBookingJump({ ...bookingJump, selected })
  }
  const previousVenue = () => {
    const selected = Number(bookingOptions[selectedBookingIndex - 1]?.value)
    setBookingJump({ ...bookingJump, selected })
  }
  const nextVenue = () => {
    const selected = Number(bookingOptions[selectedBookingIndex + 1]?.value)
    setBookingJump({ ...bookingJump, selected })
  }

  // const matching = bookingJump.bookings?.filter?.(x => x.Id === bookingJump.selected)?.[0]

  return (
    <div className="grid grid-cols-6 gap-3 mt-5 max-w-full items-center">

      <div className="col-span-4 flex grid-cols-5 gap-2 items-center">
        <Typeahead
          className="mb-0 pb-0 max-w-[500px]"
          value={bookingJump.selected}
          name="Tour"
          onChange={(selectedVenue) => changeBooking({ target: { value: selectedVenue?.value, id: 'venue' } })}
          options={[{ text: 'Please select a venue', value: '', date: '' }, ...bookingOptions]} placeholder={'Please select a venue'}
        />
        <ToolbarButton onClick={goToToday} className='!text-primary-green'>Go To Today</ToolbarButton>
        <ToolbarButton disabled={selectedBookingIndex === 0} onClick={previousVenue} className='!text-primary-green'>Previous Venue</ToolbarButton>
        <ToolbarButton disabled={selectedBookingIndex === bookingOptions?.length - 1} onClick={nextVenue} className='!text-primary-green'>Next Venue</ToolbarButton>
      </div>
      {/* SALES REPORT DOES NOT EXIST IN THE DESIGNS */}
      {/* <div>
            <Salesreport />
          </div> */}
      {/* {matching && (

        <div className="col-span-2 flex space-x-2">
          <a
            className="text-primary-green whitespace-pre transition-all duration-75 cursor-pointer py-3 bg-white rounded-md font-bold px-4 shadow-md"
            href={`https://${matching.Venue.Website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {matching.Venue.Website}
          </a>
          { matching.LandingSite && (

            <a
              className="px-2 text-primary-green whitespace-pre hover:text-white transition-all duration-75 cursor-pointer py-3 bg-white rounded-md px-4"
              href={`https://${matching.LandingSite}`}
              target="_blank"
              rel="noopener noreferrer"
            >
            Landing Page
            </a>
          )}
        </div>
      )} */}
    </div>
  )
}
export default ActionBar

// Add default props
ActionBar.defaultProps = {
  onActionBookingIdChange: () => {}
}
