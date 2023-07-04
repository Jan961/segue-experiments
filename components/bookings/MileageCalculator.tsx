import axios from 'axios'
import { ToolbarInfo } from 'components/bookings/ToolbarInfo'
import { BookingDTO } from 'interfaces'
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { DateDistancesDTO } from 'services/venueService'
import { bookingState } from 'state/booking/bookingState'
import { distanceState } from 'state/booking/distanceState'
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector'
import { DateViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { tourJumpState } from 'state/booking/tourJumpState'
import { getStops } from 'utils/getStops'

/*
  Watches the schedule and monitors changes
*/
export const MileageCalculator = () => {
  const distanceDict = useRecoilValue(distanceDictSelector)
  const setDistance = useSetRecoilState(distanceState)
  const schedule = useRecoilValue(scheduleSelector)
  const bookingDict = useRecoilValue(bookingState)
  const tourJump = useRecoilValue(tourJumpState)

  const refreshSchedule = React.useCallback(async () => {
    const stops = getStops(bookingDict)
    const { data } = await axios.post(`/api/distance/${tourJump.selected}`, stops)
    setDistance(data)
  }, [bookingDict, tourJump, setDistance])

  // Monitor distances and refresh if some are missing
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
          // We have booking references that aren't on the exact date (faded). These don't have distances
          if (booking.Date !== lookupDate) return false
          const info: DateDistancesDTO = distanceDict[lookupDate]
          return checkAndRefresh(info, booking)
        })
      })
    })
  }, [schedule, distanceDict, bookingDict, refreshSchedule])

  return (
    <ToolbarInfo label="Miles" value="?" />
  )
}
