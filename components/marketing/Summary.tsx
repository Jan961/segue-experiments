import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faSquareXmark,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { calculateWeekNumber, dateToSimple, dateTimeToTime } from 'services/dateService'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { useRecoilValue } from 'recoil'
import axios from 'axios'
import React from 'react'
import { LoadingTab } from './tabs/LoadingTab'
import { SummaryResponseDTO } from 'pages/api/marketing/summary/[BookingId]'

export const Summary = () => {
  const { selected } = useRecoilValue(bookingJumpState)
  const [summary, setSummary] = React.useState<Partial<SummaryResponseDTO>>({})
  const [loading, setLoading] = React.useState(true)

  const search = async () => {
    try {
      setLoading(true)
      // Original endpoints
      // `/api/bookings/saleable/${selected}`
      // `/api/bookings/Performances/${selected}`
      // `/api/marketing/sales/marketingSales/${selected}`

      const { data } = await axios.get(`/api/marketing/summary/${selected}`)
      setSummary(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    if (selected) {
      search()
    }
  }, [selected])

  if (loading) return (<LoadingTab />)

  if (!summary) return null
  const weekNo = calculateWeekNumber(new Date(summary.TourInfo.StartDate), new Date(summary.Info.Date))

  return (
    <>
      <div>
        <strong>Date: </strong> {dateToSimple(summary.Info.Date)}
      </div>
      <div>
        <strong>Shows:</strong> {summary.Performances.length}
      </div>
      <div>
        <strong>Times:</strong> {summary.Performances.map(x => dateTimeToTime(x.Date)).join(', ') || 'N/A' }
      </div>
      <div className={'mt-2'}>
        <strong>Venue Week:</strong> <span>{weekNo}</span>
      </div>

      <div>Total seats sold: </div>

      <div>Total sales (£): </div>
      <div>GP (£): {summary.Info.GrossProfit}</div>
      <div>AVG Ticket Price (£): </div>
      <div>Booking %: </div>
      <div>Capacity: </div>
      <div>Total Seats: {summary.Info.Seats}</div>
      <div>Currency: {summary.Info.Currency}</div>

      <div className={'mt-3'}>Marketing deal: TBA</div>
      <div>
        <strong className={'mt-5 mb-2'}>Booking Notes:</strong>
        <p>
          { summary.Notes.Booking }
        </p>
      </div>
      <div>
        <strong className={'mt-5 mb-2'}>Contract Notes:</strong>
        <p>
          { summary.Notes.Contract }
        </p>
      </div>
      <div className="border-y space-y-2">
        <div className={'mt-5'}>
          <FontAwesomeIcon icon={faUser} /> Single Seat
        </div>
        <div>
          <FontAwesomeIcon icon={faBook} /> Brochure released
        </div>
        <div>
          <FontAwesomeIcon icon={faSquareXmark} /> Not on sale
        </div>
      </div>
    </>
  )
}
