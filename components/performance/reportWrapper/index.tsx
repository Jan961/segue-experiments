'use client';
import React, { useMemo, useState } from 'react';
import swr from 'swr';
import axios from 'axios';
import ReportForm from '../reportForm';
import { PerformanceInfo } from 'types/performanceInfo';
import { CustomSelect } from './CustomSelect';
import { dateToSimple, formatDate } from 'services/dateService';
import Link from 'next/link';
import { Production } from 'prisma/generated/prisma-client';

const fetcher = async (url: string): Promise<any> => await axios(url).then((res) => res.data);

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

interface ReportWrapperProps {
  children: React.ReactNode;
  productions?: any & Production[];
}

function ReportWrapper({ children, productions }: ReportWrapperProps) {
  const [productionId, setProductionId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [performanceId, setPerformanceId] = useState('');
  const imageUrl = useMemo(() => {
    const production = productions.find((production) => production?.Id === parseInt(productionId));
    return production?.ImageUrl || '';
  }, [productionId, productions]);
  /**
   * Whenever the user selects a production from the production dropdown, we fetch
   * the booking options to populate the 'Set Booking' dropdown.
   */
  const { data: bookings, isLoading: isLoadingBookings } = swr<any[]>(
    productionId !== '' ? `/api/productions/read/venues/${productionId}` : null,
    fetcher,
    swrOptions,
  );
  /**
   * Whenever the user selects a booking from the booking dropdown, we fetch
   * the performance options to populate the 'Set Performance' dropdown.
   */
  const { data: performances, isLoading: isLoadingPerformances } = swr<PerformanceInfo[]>(
    bookingId !== '' ? `/api/performances/read/${bookingId}` : null,
    fetcher,
    swrOptions,
  );
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
  const reportInfoData = useMemo(() => {
    let data = {
      venue: '',
      town: '',
      performanceDate: '',
      performanceTime: '',
      csm: '',
      lighting: '',
      asm: '',
    };
    if (bookingId) {
      const booking = bookings.find((booking) => booking.BookingId === parseInt(bookingId));
      const venue = booking.VenueAddress.find((address) => address.TypeName === 'Main');
      data = { ...data, venue: booking?.Name || '', town: venue?.Town || '' };
    }
    if (performanceId) {
      const performance = performances.find((performance) => performance.Id === parseInt(performanceId));
      data = { ...data, performanceDate: performance?.Date || '', performanceTime: performance?.Date || '' };
    }
    return data;
  }, [bookings, bookingId, performanceId, performances]);

  /**
   * There is no 'image' field in the JSON files you provided.
   * If it should be present in 'show.json,' then the 'productionInfo' should include it to make it available here.
   */
  const reportImageUrl = '/show-img.jpg';

  return (
    <div className="max-w-screen-xl m-auto">
      <nav className="flex gap-4 items-center py-4">
        <div>
          <Link href="/performance/reports" className="text-gray-900  font-bold hover:text-gray-600 ">
            Reports
          </Link>
        </div>
        <div>
          <Link href="/performance/reports/add" className="text-gray-900 hover:text-gray-600 font-bold">
            Add Report
          </Link>
        </div>
      </nav>
      <main className="p-2 pb-20">
        <h1 className="my-2 font-bold text-6xl text-center text-sky-400">Show Report</h1>
        <div className="md:flex  mx-auto gap-8 items-end mt-8 shadow-md rounded-md overflow-hidden p-6 bg-white">
          <div className="border w-52">
            <img src={imageUrl} alt="show" width={206} height={150} />
          </div>

          <div className="flex-1 mt-8 md:mt-0">
            <CustomSelect
              label="Set Production:"
              placeholder="Select Production"
              value={productionId}
              onChange={(e) => {
                setProductionId(e.target.value);
                setBookingId('');
                setPerformanceId('');
              }}
              disabled={false}
              options={children}
              isLoading={false}
            />
            <CustomSelect
              label="Set Venue:"
              placeholder="Select Venue"
              value={bookingId}
              onChange={(e) => {
                setBookingId(e.target.value);
                setPerformanceId('');
              }}
              disabled={productionId === ''}
              options={bookings?.map((venue) => (
                <option key={venue.BookingId} value={venue.BookingId}>
                  {`${venue?.Code} ${venue?.Name}, ${venue?.Town} ${dateToSimple(venue?.booking?.FirstDate)}`}
                </option>
              ))}
              isLoading={isLoadingBookings}
            />

            <CustomSelect
              label="Set Performance:"
              placeholder="Select Performance"
              value={performanceId}
              onChange={(e) => setPerformanceId(e.target.value)}
              disabled={bookingId === ''}
              options={performances?.map(({ Id, Date: performanceDate }) => (
                <option key={Id} value={Id}>
                  {formatDate(performanceDate, 'PPPppp')}
                </option>
              ))}
              isLoading={isLoadingPerformances}
            />
          </div>
        </div>

        <div className="mt-8 shadow-md rounded-md overflow-hidden p-5">
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
  );
}

export default ReportWrapper;
