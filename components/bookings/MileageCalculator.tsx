import axios from 'axios'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { distanceState } from 'state/booking/distanceState'
import { getStops } from 'utils/getStops'

/*
  Watches the schedule and monitors changes
*/
export const MileageCalculator = () => {
  const [distance, setDistance] = useRecoilState(distanceState)
  const bookingDict = useRecoilValue(bookingState)

  // Monitor distances and refresh if some are missing
  React.useEffect(() => {
    if (!distance.outdated) return

    const refresh = async () => {
      const stops = getStops(bookingDict)
      const { data } = await axios.post('/api/distance', stops)
      setDistance({ ...distance, stops: data, outdated: false })
    }

    refresh()
  }, [distance, setDistance, bookingDict])

  return null
}
