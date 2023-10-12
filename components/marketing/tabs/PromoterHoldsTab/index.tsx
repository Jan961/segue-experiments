import React, { useEffect, useMemo } from 'react'
import { LoadingTab } from '../LoadingTab'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { NoDataWarning } from '../../NoDataWarning'
import { PerformanceSection } from './PerformanceSection'
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox'
import { FormInputText } from 'components/global/forms/FormInputText'
import { debounce } from 'radash'

const defaultInputs = {
  CastRateTicketsArranged: false,
  CastRateTicketsNotes: ''
}
export const PromoterHoldsTab = () => {
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState)
  const { selected } = bookingJump
  const [inputs, setInputs] = React.useState(defaultInputs)
  const [loading, setLoading] = React.useState(true)

  const [performances, setPerformances] = React.useState([])
  const selectedBooking = useMemo(() => bookingJump.bookings?.find?.(x => x.Id === selected), [bookingJump.bookings, selected])
  useEffect(() => {
    const { CastRateTicketsArranged, CastRateTicketsNotes } = selectedBooking
    setInputs({ CastRateTicketsArranged, CastRateTicketsNotes })
  }, [bookingJump.selected])
  const search = async () => {
    setLoading(true)
    const { data } = await axios.get(`/api/marketing/promoterHolds/${selected}`)
    console.log(data)
    setPerformances(data)
    setLoading(false)
  }

  React.useEffect(() => {
    search()
  }, [selected])

  const updateBooking = (BookingId:number, payload:any) => {
    axios.put('/api/marketing/activities/booking/update', { Id: BookingId, ...payload })
      .then(() => {
        setBookingJump({
          ...bookingJump,
          bookings: bookingJump.bookings.map(booking => {
            if (booking.Id === BookingId) {
              return { ...booking, ...payload }
            }
            return booking
          })
        })
      })
      .catch(error => console.log('Error Updating booking', error))
  }
  const debouncedUpdateBooking = useMemo(() => debounce({ delay: 500 }, updateBooking), [])
  const handleChange = (e:any) => {
    setInputs(prev => ({ ...prev, [e.target.id]: e.target.value }))
    debouncedUpdateBooking(selectedBooking?.Id, { [e.target.id]: e.target.value })
  }

  if (loading) return (<LoadingTab />)

  if (performances.length === 0) return (<NoDataWarning message="No performances for this booking." />)
  return (
    <>
      <br />
      {selectedBooking && <form>
        <FormInputCheckbox className="max-w-[250px]" label="CAST RATE TICKETS ARRANGED" name="CastRateTicketsArranged" onChange={handleChange} value={inputs.CastRateTicketsArranged} />
        <FormInputText className="h-[75px]" label="" name="CastRateTicketsNotes" onChange={handleChange} value={inputs.CastRateTicketsNotes} disabled={!inputs.CastRateTicketsArranged} />
      </form>}
      { performances.map((perf) => (
        <PerformanceSection perf={perf} key={perf.Id} triggerSearch={search}/>
      ))}
    </>
  )
}
