import { calculateWeekNumber, dateToSimple, getTimeFromDateAndTime } from 'services/dateService'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { useRecoilValue } from 'recoil'
import axios from 'axios'
import React from 'react'
import numeral from 'numeral'
import { LoadingTab } from './tabs/LoadingTab'
import { SummaryResponseDTO } from 'pages/api/marketing/summary/[BookingId]'
import { DescriptionList as DL } from 'components/global/DescriptionList'
import moment from 'moment'

export const formatCurrency = (ammount, currency: string) => {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0
  })

  return formatter.format(ammount)
}

export const Summary = () => {
  const { selected } = useRecoilValue(bookingJumpState)
  const [summary, setSummary] = React.useState<Partial<SummaryResponseDTO>>({})
  const [loading, setLoading] = React.useState(false)

  const search = async () => {
    try {
      setLoading(true)
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
  const weekNo = calculateWeekNumber(new Date(summary?.TourInfo?.StartDate), new Date(summary?.TourInfo?.Date))

  if (!summary?.Info) return null

  const currency = summary?.Info?.VenueCurrencyCode
  const info = summary?.Info
  const notes = summary?.Notes

  return (
    <div className='text-sm mt-4'>
      <h3 className='mb-1 text-base font-bold text-primary-blue'>General Info</h3>
      <DL>
        <DL.Term>
          First Date
        </DL.Term>
        <DL.Desc>
          {dateToSimple(summary?.TourInfo?.Date)}
        </DL.Desc>
        <DL.Term>
          Last Date
        </DL.Term>
        <DL.Desc>
          {dateToSimple(summary?.TourInfo?.lastDate)}
        </DL.Desc>
        <DL.Term>
          Number of Day(s)
        </DL.Term>
        <DL.Desc>
          {summary?.TourInfo?.numberOfDays}
        </DL.Desc>
        <DL.Term>
          Tour Week No
        </DL.Term>
        <DL.Desc>
          {weekNo}
        </DL.Desc>
        <DL.Term>
          Performance Time(s)
        </DL.Term>
        <DL.Desc>
          {summary.Performances?.map?.((x, i) => <p key={i}>{`${moment(x.Date).format('dddd').substring(0, 3)} ${dateToSimple(x.Date)} ${x.Time ? getTimeFromDateAndTime(x.Time) : ''}`}</p>) || 'N/A' }
        </DL.Desc>
      </DL>
      <h3 className='mb-1 mt-4 text-base font-bold text-primary-blue'>Sales Summary</h3>
      <DL>
        <DL.Term>
          Total Seats Sold
        </DL.Term>
        <DL.Desc>
          {numeral(info.SeatsSold).format('0,0') || '-'}
        </DL.Desc>
        <DL.Term>
          Total Sales ({currency})
        </DL.Term>
        <DL.Desc>
          {info.SalesValue ? formatCurrency(info.SalesValue, currency) : '-'}
        </DL.Desc>
        <DL.Term>
          Gross Potential
        </DL.Term>
        <DL.Desc>
          {formatCurrency(info.GrossPotential, currency)}
        </DL.Desc>
        <DL.Term>
          AVG Ticket Price
        </DL.Term>
        <DL.Desc>
          {formatCurrency(info.AvgTicketPrice, currency)}
        </DL.Desc>
        <DL.Term>
          Booking %
        </DL.Term>
        <DL.Desc>
          {info.seatsSalePercentage ? `${info.seatsSalePercentage}%` : '-'}
        </DL.Desc>
        <DL.Term>
          Capacity
        </DL.Term>
        <DL.Desc>
          {numeral(info.Capacity).format('0,0') || '-'}
        </DL.Desc>
        <DL.Term>
          Perf(s)
        </DL.Term>
        <DL.Desc>
          {summary?.Performances?.length}
        </DL.Desc>
        <DL.Term>
          Total Seats
        </DL.Term>
        <DL.Desc>
          {numeral(info.Seats).format('0,0') || '-'}
        </DL.Desc>
        <DL.Term>
          Currency
        </DL.Term>
        <DL.Desc>
          {info.VenueCurrencyCode || '-'}
        </DL.Desc>
      </DL>
      { notes && (
        <>
          <h3 className="mb-1 mt-4 text-base font-bold text-primary-blue">Notes</h3>
          <DL inline={false}>
            <DL.Term>
              Marketing Deal
            </DL.Term>
            <DL.Desc className='mb-4'>
              <span>{ notes.MarketingDealNotes ? notes.MarketingDealNotes : 'None' }</span>
            </DL.Desc>
            <DL.Term>
              Booking Notes
            </DL.Term>
            <DL.Desc className='mb-4'>
              <span>{ notes.BookingNotes ? notes.BookingNotes : 'None' }</span>
            </DL.Desc>
            <DL.Term>
              Booking Deal Notes
            </DL.Term>
            <DL.Desc className='mb-4'>
              <span>{ notes.BookingDealNotes ? notes.BookingDealNotes : 'None' }</span>
            </DL.Desc>
            <DL.Term>
              Hold Notes
            </DL.Term>
            <DL.Desc className='mb-4'>
              <span>{ notes.HoldNotes ? notes.HoldNotes : 'None' }</span>
            </DL.Desc>
            <DL.Term>
              Comp Notes
            </DL.Term>
            <DL.Desc className='mb-4'>
              <span>{ notes.CompNotes ? notes.CompNotes : 'None' }</span>
            </DL.Desc>
          </DL>
        </>
      )}

    </div>
  )
}
