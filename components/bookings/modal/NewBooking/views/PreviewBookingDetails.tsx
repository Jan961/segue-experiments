import Table from 'components/core-ui-lib/Table';
import { styleProps, previewColumnDefs } from 'components/bookings/table/tableConfig';
import { BookingItem, PreviewDataItem, TForm } from '../reducer';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import { calculateWeekNumber } from 'services/dateService';

import { addDays, subDays, parseISO, isWithinInterval } from 'date-fns';
import { venueState } from 'state/booking/venueState';
import { bookingStatusMap } from 'config/bookings';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { useEffect, useState } from 'react';
import { DistanceParams } from 'distance';
import axios from 'axios';

const rowClassRules = {
  'custom-red-row': (params) => {
    const rowData = params.data;
    // Apply custom style if the 'highlightRow' property is true
    return rowData && rowData.highlightRow;
  },
};

const gridOptions = {
  getRowStyle: (params) => {
    return params.data.bookingStatus === 'Pencilled' ? { fontStyle: 'italic' } : '';
  },
};

export type PreviewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
  data: BookingItem[];
  dayTypeOptions: SelectOption[];
  updateModalTitle: (title: string) => void;
};
export default function PreviewBookingDetails({
  formData,
  productionCode,
  data,
  dayTypeOptions,
}: PreviewBookingDetailsProps) {
  const venueDict = useRecoilValue(venueState);
  const production = useRecoilValue(currentProductionSelector);
  const { rows: bookings } = useRecoilValue(rowsSelector);
  const [rows, setRows] = useState([]);

  const fetchMileageforVenues = async (payload: DistanceParams, rowsToUpdate: any) => {
    const { data } = await axios.post('/api/distance', payload);

    if (data && data.length > 0) {
      const updated = rowsToUpdate.map((row) => {
        const distance = data.find((d) => d.Date === row?.dateTime || d.Date === row?.dateAsISOString);
        if (distance) {
          const { Miles, Mins } = distance.option[0];
          return { ...row, miles: Miles, travelTime: Mins };
        }
        return row;
      });
      setRows(updated);
    }
  };

  const getDistanceInfo = (previousDates, newDates, futureDates) => {
    if (newDates) {
      // Filter all rows that have a venue and booking status is Pencilled or Confirmed
      const rowsWithVenues = newDates.filter(({ item }) => typeof item.venue === 'number');
      if (rowsWithVenues?.length > 0) {
        // Find consecutive dates with same venue. Only the last date will have mileage information
        const rowsWithUniqueVenue = rowsWithVenues.reduce((acc, item) => {
          if (acc.length === 0) {
            acc.push(item);
          } else {
            const lastItem = acc[acc.length - 1];
            if (lastItem.venue === item.venue) {
              acc.splice(-1, 1, item);
            } else {
              acc.push(item);
            }
          }

          return acc;
        }, []);

        const previousRowToUpdate = previousDates?.findLast(
          ({ venueId, bookingStatus }) =>
            !!venueId &&
            typeof venueId === 'number' &&
            (bookingStatus === 'Confirmed' || bookingStatus === 'Pencilled'),
        );
        const nextRowToUpdate = futureDates?.find(
          ({ venueId, bookingStatus }) =>
            !!venueId &&
            typeof venueId === 'number' &&
            (bookingStatus === 'Confirmed' || bookingStatus === 'Pencilled'),
        );

        if (previousRowToUpdate) {
          rowsWithUniqueVenue.unshift(previousRowToUpdate);
        }
        if (nextRowToUpdate) {
          rowsWithUniqueVenue.push(nextRowToUpdate);
        }

        const payload = rowsWithUniqueVenue.map((row) => {
          return { Date: row.dateTime || row.dateAsISOString, Ids: [row.venueId || row.item?.venue] };
        });
        fetchMileageforVenues(payload, [...previousDates, ...newDates, ...futureDates]);
      }
    }
  };

  const filterBookingsByDateRange = (bookings = [], startDate: Date, endDate: Date) => {
    const filteredBookings = [];
    bookings.forEach((booking) => {
      const bookingDate = parseISO(booking.dateTime);

      // Check if the booking date is within the specified range
      const isWithinRange = isWithinInterval(bookingDate, { start: startDate, end: endDate });

      if (isWithinRange) {
        // If the booking is within the range, push it to the new array
        filteredBookings.push(booking);
      }
    });

    const sortedFilteredBookings = filteredBookings.sort((a, b) => {
      const dateA = parseISO(a.dateTime).getTime();
      const dateB = parseISO(b.dateTime).getTime();

      return dateA - dateB;
    });

    return sortedFilteredBookings;
  };

  const formatRowData = () => {
    const rowItems: PreviewDataItem[] = data.map((item: any) => {
      const calculateWeek = () => {
        return calculateWeekNumber(new Date(production.StartDate), new Date(item.dateAsISOString));
      };
      return {
        ...item,
        highlightRow: true,
        venue: item.venue
          ? venueDict[item.venue].Name
          : dayTypeOptions.find((option) => option.value === item.dayType)?.text,
        town: item.venue && item.dayType !== null ? venueDict[item.venue].Town : '',
        capacity: item.venue && item.dayType !== null ? venueDict[item.venue].Seats : null,
        dayType: dayTypeOptions.find((option) => option.value === item.dayType)?.text,
        production: productionCode.split(' ')[0],
        bookingStatus: bookingStatusMap[item.bookingStatus],
        status: item.bookingStatus,
        performanceCount: item.noPerf?.toString() || '',
        performanceTimes: item.times,
        week: calculateWeek(),
        miles: '',
        travelTime: '',
        item,
      };
    });

    const { fromDate, toDate } = formData;
    const fromDateAsDate = parseISO(fromDate);
    const toDateAsDate = parseISO(toDate);
    const pastStartDate = subDays(fromDateAsDate, 6);
    const toDateSet = addDays(toDateAsDate, 1);
    const futureEndDate = addDays(toDateAsDate, 7);
    const filteredBookingsTop = filterBookingsByDateRange(bookings, pastStartDate, fromDateAsDate);
    const filteredBookingsBottom = filterBookingsByDateRange(bookings, toDateSet, futureEndDate);
    setRows([...filteredBookingsTop, ...rowItems, ...filteredBookingsBottom]);
    getDistanceInfo(filteredBookingsTop, rowItems, filteredBookingsBottom);
  };

  useEffect(() => {
    if (data) {
      formatRowData();
    }
  }, [data]);

  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      </div>
      <div className="w-[700px] lg:w-[1386px] h-full  z-[999] flex flex-col ">
        <Table
          gridOptions={gridOptions}
          rowData={rows}
          columnDefs={previewColumnDefs}
          styleProps={styleProps}
          rowClassRules={rowClassRules}
        />
      </div>
    </>
  );
}
