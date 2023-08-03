import { Table } from 'components/global/table/Table'

import BookingSelection from './BookingSelection'
import React, { useMemo } from 'react'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { LoadingTab } from './LoadingTab'
import { useRouter } from 'next/router'
import { dateToSimple } from 'services/dateService'

export const ArchivedSalesTab = () => {
  const router = useRouter()
  const [archivedSales, setArchivedSales] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [salesByType, setSalesByType] = React.useState(null)
  const { selected, bookings } = useRecoilValue(bookingJumpState)
  const [tours, setTours] = React.useState<any[]>([])
  const selectedBooking = useMemo(() => bookings.find(booking => booking.Id === selected), [bookings, selected])
  if (loading) return (<LoadingTab />)
  const openBookingSelection = (type) => {
    setSalesByType(type)
  }

  const getBookingSales = async (bookingIds, tours) => {
    setTours(tours)
    setLoading(true)
    try {
      const { data } = await axios.post('/api/marketing/sales/read/archived', { bookingIds })
      setArchivedSales(data.response)
    } catch (error:any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* <HardCodedWarning message="This is hard-coded server-side"/> */}
      <div className={'mb-1 space-x-3 pb-4'}>
        <button onClick={() => openBookingSelection('venue')} className={'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}>For this Venue </button>
        <button onClick={() => openBookingSelection('town')} className={'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}>For this Town </button>
        {
          salesByType &&
            <BookingSelection
              venueCode={selectedBooking?.Venue?.Code}
              showCode={router.query.ShowCode}
              salesByType={salesByType}
              onSubmit={getBookingSales}
              onClose={() => setSalesByType(null)} />
        }
      </div>
      {archivedSales?.length
        ? <Table>
          <Table.HeaderRow>
            <Table.HeaderCell>
            </Table.HeaderCell>
            <Table.HeaderCell>
            </Table.HeaderCell>
            {
              tours.map((tour, i) => (
                <>
                  <Table.HeaderCell className="text-right" key={i}>
                    {tour.FullTourCode}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                  </Table.HeaderCell>
                </>
              ))
            }
          </Table.HeaderRow>
          <Table.HeaderRow>
            <Table.HeaderCell>
          Week
            </Table.HeaderCell>
            <Table.HeaderCell>
          Week of
            </Table.HeaderCell>
            {
              tours.map((_, i) => (
                <>
                  <Table.HeaderCell>
                    Num
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    S Value
                  </Table.HeaderCell>
                </>
              ))
            }

          </Table.HeaderRow>
          <Table.Body>
            {archivedSales.map((sale, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  {sale.SetTourWeekNum}
                </Table.Cell>
                <Table.Cell>
                  {dateToSimple(sale.SetTourWeekDate)}
                </Table.Cell>
                {
                  sale.data.map((tourSale) => (
                    <>
                      <Table.Cell className="text-right">
                        {tourSale.Seats}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {tourSale.ValueWithCurrencySymbol}
                      </Table.Cell>
                    </>
                  ))
                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        : <div>Please select archived tours</div>}
    </>
  )
}
