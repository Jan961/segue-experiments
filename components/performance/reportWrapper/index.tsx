'use client'
import React, { useMemo, useState } from 'react'
import swr from 'swr'
import axios from 'axios'
import ReportForm from '../reportForm'
import Image from 'next/image'
import { BookingInfo } from 'types/bookingInfo'
import { PerformanceInfo } from 'types/performanceInfo'
import { ReportInfo } from 'types/reportInfo'
import { CustomSelect } from './CustomSelect'
import { dateToSimple } from 'services/dateService'
import { format } from 'date-fns'

const fetcher = async (url: string): Promise<any> => await axios(url).then((res) => res.data)

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
}

interface ReportWrapperProps {
  children: React.ReactNode
}

function ReportWrapper ({ children }: ReportWrapperProps) {
  const [tourId, setTourId] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [performanceId, setPerformanceId] = useState('')

  /**
   * Whenever the user selects a tour from the tour dropdown, we fetch
   * the booking options to populate the 'Set Booking' dropdown.
 */
  const { data: bookings, isLoading: isLoadingBookings } = swr<any[]>(
    tourId !== '' ? `/api/tours/read/venues/${tourId}` : null,
    fetcher,
    swrOptions
  )
  /**
  * Whenever the user selects a booking from the booking dropdown, we fetch
  * the performance options to populate the 'Set Performance' dropdown.
*/
  const { data: performances, isLoading: isLoadingPerformances } = swr<PerformanceInfo[]>(
    bookingId !== '' ? `/api/performances/read/${bookingId}` : null,
    fetcher,
    swrOptions
  )
  /**
  * Whenever the user selects a performance, we fetch ther rport data
*/
  // const { data: reportInfoData } = swr<ReportInfo>(
  //   bookingId !== '' && performanceId !== ''
  //     ? `/api/reportInfo/${bookingId}/${performanceId}`
  //     : null,
  //   fetcher,
  //   swrOptions
  // )
  const reportInfoData = useMemo(()=>{
    let data={
      venue:'', town:'', performanceDate:'', performanceTime:'', cms:'', lighting:'', asm:''
    };
    if(bookingId){
      const booking = bookings.find(booking=>booking.BookingId===parseInt(bookingId))
      const venue = booking.VenueAddress.find(address=>address.TypeName==='Main')
      data={...data, venue:booking?.Name||'', town:venue?.Town||'' }
    }
    if(performanceId){
      const performance=performances.find(performance=>performance.Id===parseInt(performanceId))
      data={...data, performanceDate: performance?.Date||'', performanceTime: performance?.Date||'' }
    }
    return data
  },[bookings, bookingId, performanceId, performances])
 
  /**
   * There is no 'image' field in the JSON files you provided.
   * If it should be present in 'show.json,' then the 'tourInfo' should include it to make it available here.
   */
  const reportImageUrl = '/show-img.jpg'

  return (
    <div className='max-w-screen-xl m-auto'>
      <main className='p-2 pb-20'>
        <h1 className='my-2 font-bold text-6xl text-center text-sky-400'>
        Show Report
        </h1>
        <div className='md:flex  mx-auto gap-8 items-end mt-16 shadow-md rounded-md overflow-hidden p-6 bg-white'>
          <div className='border w-52'>
            <Image src={reportImageUrl} alt='show' width={206} height={150} priority />
          </div>

          <div className='flex-1 mt-8 md:mt-0'>
            <CustomSelect
              label='Set Tour:'
              value={tourId}
              onChange={(e) => {
                setTourId(e.target.value)
                setBookingId('')
                setPerformanceId('')
              }}
              disabled={false}
              options={children}
              isLoading={false}

            />
            <CustomSelect
              label='Set Booking:'
              value={bookingId}
              onChange={(e) => {
                setBookingId(e.target.value)
                setPerformanceId('')
              }}
              disabled={tourId === ''}
              options={bookings?.map((venue) => (
                <option key={venue.BookingId} value={venue.BookingId}>
                  {`${venue?.Code} ${venue?.Name}, ${
                    venue?.Town
                  } ${dateToSimple(venue?.booking?.FirstDate)}`}
                </option>
              ))}
              isLoading={isLoadingBookings}
            />

            <CustomSelect
              label='Set Performance:'
              value={performanceId}
              onChange={(e) => setPerformanceId(e.target.value)}
              disabled={bookingId === ''}
              options={performances?.map(({ Id, Date:performanceDate }) => (
                <option key={Id} value={Id}>
                  {format(new Date(performanceDate),'PPPppp')}
                </option>
              ))}
              isLoading={isLoadingPerformances}
            />

          </div>
        </div>

        <div className='mt-16 shadow-md rounded-md overflow-hidden p-5'>
          <ReportForm
            bookingId={bookingId}
            performanceId={performanceId}
            reportData={reportInfoData}
            reportImageUrl={reportImageUrl}
            editable
          />
        </div>
      </main>
    </div>
  )
}

export default ReportWrapper
