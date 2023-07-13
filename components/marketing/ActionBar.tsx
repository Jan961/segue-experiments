import { ToolbarButton } from 'components/bookings/ToolbarButton'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { useRecoilState } from 'recoil'
import { formatDateUK, getWeekDay } from 'services/dateService'
import { bookingJumpState } from 'state/marketing/bookingJumpState'

const ActionBar = () => {
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState)

  const tourOptions: SelectOption[] = bookingJump.bookings.map((b) => {
    const date = new Date(b.Date)
    const weekday = getWeekDay(date)
    const ukDate = formatDateUK(date)
    return { text: `${weekday} ${ukDate} | ${b.Venue.Name}`, value: b.Id }
  })

  const changeBooking = (e) => {
    const selected = e.target.value
    setBookingJump({ ...bookingJump, selected })
  }

  const matching = bookingJump.bookings.filter(x => x.Id === bookingJump.selected)[0]
  console.log(matching)

  return (
    <div className="grid grid-cols-6 gap-3 mt-5 max-w-full items-center">
      {matching && (

        <div className="col-span-2 flex space-x-2">
          <a
            className="px-2 text-primary-green whitespace-pre hover:text-white bg-transparent hover:bg-primary-green transition-all duration-75 cursor-pointer py-2  border border-primary-green rounded-md"
            href={`https://${matching.Venue.Website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {matching.Venue.Website}
          </a>
          { matching.LandingSite && (

            <a
              className="px-2 text-primary-green whitespace-pre hover:text-white bg-transparent hover:bg-primary-green transition-all duration-75 cursor-pointer py-2  border border-primary-green rounded-md"
              href={`https://${matching.LandingSite}`}
              target="_blank"
              rel="noopener noreferrer"
            >
          Landing Page
            </a>
          )}
        </div>
      )}
      <div className="col-span-4 flex grid-cols-5 gap-2 items-center">
        <ToolbarButton>Go To Today</ToolbarButton>
        <ToolbarButton>Previous Date</ToolbarButton>
        <ToolbarButton>Next Date</ToolbarButton>

        <FormInputSelect
          className="mb-0"
          value={bookingJump.selected}
          name="Tour"
          onChange={changeBooking}
          options={tourOptions}
        />
      </div>
      {/* SALES REPORT DOES NOT EXIST IN THE DESIGNS */}
      {/* <div>
            <Salesreport />
          </div> */}
    </div>
  )
}
export default ActionBar

// Add default props
ActionBar.defaultProps = {
  onActionBookingIdChange: () => {}
}
