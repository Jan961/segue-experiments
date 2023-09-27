import { Table } from 'components/global/table/Table'

import BookingSelection from './BookingSelection'
import React, { useEffect, useMemo } from 'react'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { bookingJumpState } from 'state/marketing/bookingJumpState'
import { LoadingTab } from './LoadingTab'
import { useRouter } from 'next/router'
import { dateToSimple } from 'services/dateService'
import { tourJumpState } from 'state/booking/tourJumpState'
import classNames from 'classnames'

export const ArchivedSalesTab = () => {
  const router = useRouter()
  const [archivedSales, setArchivedSales] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [salesByType, setSalesByType] = React.useState(null)
  const { selected, bookings } = useRecoilValue(bookingJumpState)
  const { selected: selectedTour, tours: toursList } =
    useRecoilValue(tourJumpState)
  const [tours, setTours] = React.useState<any[]>([])
  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.Id === selected),
    [bookings, selected]
  )
  const openBookingSelection = (type) => {
    setSalesByType(type)
  }
  const getBookingSales = async (bookingIds, tours) => {
    setTours(tours)
    setLoading(true)
    try {
      const { data } = await axios.post('/api/marketing/sales/read/archived', {
        bookingIds
      })
      setArchivedSales(data.response)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (selected) {
      const tour = toursList.find((tour) => tour.Id === selectedTour)
      getBookingSales(
        [selected],
        [{ FullTourCode: `${tour.ShowCode}${tour.Code}` }]
      )
    }
  }, [selected])
  if (loading) return <LoadingTab />

  return (
    <>
      {/* <HardCodedWarning message="This is hard-coded server-side"/> */}
      <div className={'mb-1 space-x-3 pb-4 mt-4'}>
        <button
          onClick={() => openBookingSelection('venue')}
          className={
            'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        >
          For this Venue{' '}
        </button>
        <button
          onClick={() => openBookingSelection('town')}
          className={
            'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-medium drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        >
          For this Town{' '}
        </button>
        {salesByType && (
          <BookingSelection
            venueCode={selectedBooking?.Venue?.Code}
            showCode={router.query.ShowCode}
            salesByType={salesByType}
            onSubmit={getBookingSales}
            onClose={() => setSalesByType(null)}
          />
        )}
      </div>
      {archivedSales?.length
        ? (
          <Table className="table-auto !min-w-0">
            <Table.HeaderRow>
              <Table.HeaderCell className="w-20"></Table.HeaderCell>
              <Table.HeaderCell className="w-20"></Table.HeaderCell>
              {tours.map((tour, i) => (
                <>
                  <Table.HeaderCell className="text-right w-20" key={i}>
                    {tour.FullTourCode}
                  </Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </>
              ))}
            </Table.HeaderRow>
            <Table.HeaderRow>
              <Table.HeaderCell className="w-40 text-center">
              Week
              </Table.HeaderCell>
              <Table.HeaderCell className="w-20">Week of</Table.HeaderCell>
              {tours.map((_, i) => (
                <>
                  <Table.HeaderCell className={classNames('w-20')}>Num</Table.HeaderCell>
                  <Table.HeaderCell className={classNames('w-20')}>S Value</Table.HeaderCell>
                </>
              ))}
            </Table.HeaderRow>
            <Table.Body>
              {archivedSales.map((sale, i) => (
                <Table.Row key={i}>
                  <Table.Cell className="text-center">
                  Week {sale.SetBookingWeekNum}
                  </Table.Cell>
                  <Table.Cell>{dateToSimple(sale.SetTourWeekDate)}</Table.Cell>
                  {sale.data.map((tourSale, i) => (
                    <>
                      <Table.Cell className={classNames('text-right', { 'bg-gray-100': i % 2 === 0 })}>
                        {tourSale.Seats}
                      </Table.Cell>
                      <Table.Cell className={classNames('text-right', { 'bg-gray-100': i % 2 === 0 })}>
                        {tourSale.ValueWithCurrencySymbol}
                      </Table.Cell>
                    </>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )
        : (
          <div>Please select archived tours</div>
        )}
    </>
  )
}
