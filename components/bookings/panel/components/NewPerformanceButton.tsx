import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { PerformanceDTO } from 'interfaces'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { performanceState } from 'state/booking/performanceState'

interface NewPerformanceButtonProps {
  bookingId: number
}

export const NewPerformanceButton = ({ bookingId }:NewPerformanceButtonProps) => {
  const [submitting, setSubmitting] = React.useState(false)
  const [perfDict, setPerfDict] = useRecoilState(performanceState)
  const bookingDict = useRecoilValue(bookingState)

  const createPerformance = async () => {
    setSubmitting(true)

    const Date = bookingDict[bookingId].Date.replace('T00:00:00.000Z', 'T19:00:00.000')

    const newPerf: Partial<PerformanceDTO> = {
      BookingId: bookingId,
      Date
    }

    try {
      const { data } = await axios.post('/api/performances/create', newPerf)
      setSubmitting(false)
      const newState = { ...perfDict, [data.Id]: data }
      setPerfDict(newState)
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <FormInputButton onClick={createPerformance} text='Add Performance' icon={faPlus} disabled={submitting} className='w-full'/>
  )
}
