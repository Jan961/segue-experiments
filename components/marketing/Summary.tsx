import { calculateWeekNumber, dateToSimple, dateTimeToTime } from 'services/dateService'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { useRecoilValue } from 'recoil'
import axios from 'axios'
import React from 'react'
import { LoadingTab } from './tabs/LoadingTab'
import { SummaryResponseDTO } from 'pages/api/marketing/summary/[BookingId]'
import { DescriptionList as DL } from 'components/global/DescriptionList'

type props={
  salesSummary:any;
}

export const Summary = ({ salesSummary }:props) => {
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
      <h3 className='my-4 mb-2'>General Info</h3>
      <DL>
        <DL.Term>
          Date
        </DL.Term>
        <DL.Desc>
          {dateToSimple(summary.Info.Date)}
        </DL.Desc>
        <DL.Term>
          Week No
        </DL.Term>
        <DL.Desc>
          {weekNo}
        </DL.Desc>
        <DL.Term>
          Shows
        </DL.Term>
        <DL.Desc>
          {summary.Performances.length}
        </DL.Desc>
        <DL.Term>
          Times
        </DL.Term>
        <DL.Desc>
          {summary.Performances.map(x => dateTimeToTime(x.Date)).join(', ') || 'N/A' }
        </DL.Desc>
      </DL>
      <hr className='border-gray-500 border-opacity-50 my-4'/>
      <h3 className='mb-2'>Sales Summary</h3>
      <DL>
        <DL.Term>
          Total Seats Sold
        </DL.Term>
        <DL.Desc>
          {salesSummary?.seatsSold || '-'}
        </DL.Desc>
        <DL.Term>
          Gross Profit
        </DL.Term>
        <DL.Desc>
          TODO
        </DL.Desc>
        <DL.Term>
          Avg Ticket Price
        </DL.Term>
        <DL.Desc>
          TODO
        </DL.Desc>
        <DL.Term>
          Percent Booked
        </DL.Term>
        <DL.Desc>
          {salesSummary?.seatsSalePercentage || '-'}
        </DL.Desc>
        <DL.Term>
          Capacity
        </DL.Term>
        <DL.Desc>
          {salesSummary?.capacity || '-'}
        </DL.Desc>
        <DL.Term>
          Total Seats
        </DL.Term>
        <DL.Desc>
          {salesSummary?.capacity || '-'}
        </DL.Desc>
        <DL.Term>
          Currency
        </DL.Term>
        <DL.Desc>
          {`${salesSummary?.venueCurrencySymbol}${salesSummary?.totalValue}` || '-'}
        </DL.Desc>
      </DL>
      <hr className='border-gray-500 border-opacity-50 my-4'/>
      <h3 className='mb-2'>Notes</h3>
      <DL inline={false}>
        <DL.Term>
          Marketing Deal
        </DL.Term>
        <DL.Desc>
          TODO
        </DL.Desc>
        <DL.Term>
          Booking Notes
        </DL.Term>
        <DL.Desc>
          { summary.Notes.Booking }
        </DL.Desc><DL.Term>
          Marketing Deal
        </DL.Term>
        <DL.Desc>
          { summary.Notes.Contract }
        </DL.Desc>
      </DL>
    </>
  )
}
