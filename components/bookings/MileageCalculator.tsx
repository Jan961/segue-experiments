import { ToolbarInfo } from 'components/bookings/ToolbarInfo'
import { BookingDTO } from 'interfaces'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { DateDistancesDTO, DistanceStop } from 'services/venueService'
import { bookingState } from 'state/booking/bookingState'
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector'
import { DateViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { getStops } from 'utils/getStops'

/*
  Watches the schedule and monitors changes
*/
export const MileageCalculator = () => {
  const distanceDict = useRecoilValue(distanceDictSelector)
  const schedule = useRecoilValue(scheduleSelector)
  const bookingDict = useRecoilValue(bookingState)

  const refreshSchedule = () => {
    console.log('REFRESH SCHEDULE')

    const stops = getStops(bookingDict)
  }

  React.useEffect(() => {
    const checkAndRefresh = (info: DateDistancesDTO, booking: BookingDTO) => {
      if (info) {
        const matching = info.option.filter((x) => x.VenueId === booking.VenueId)
        if (matching.length === 0) {
          refreshSchedule()
          return true
        }
      } else {
        refreshSchedule()
        return true
      }
      return false
    }

    schedule.Sections.some(section => {
      return (section.Dates as DateViewModel[]).some(date => {
        const lookupDate = new Date(date.Date).toISOString()
        return date.BookingIds.some(bookingId => {
          const booking = bookingDict[bookingId]
          const info: DateDistancesDTO = distanceDict[lookupDate]
          return checkAndRefresh(info, booking)
        })
      })
    })
  }, [schedule, distanceDict, bookingDict])

  return (
    <ToolbarInfo label="Miles" value="?" />
  )
}
