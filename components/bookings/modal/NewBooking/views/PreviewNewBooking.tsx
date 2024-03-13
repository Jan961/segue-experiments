import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { BookingItem, PreviewDataItem, TForm } from '../reducer';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import { getDateDaysAgo, getDateDaysInFuture, toSql, calculateWeekNumber } from 'services/dateService';
import moment from 'moment';
import { venueState } from 'state/booking/venueState';
import { bookingStatusMap } from 'config/bookings';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { distanceState } from 'state/booking/distanceState';
import { steps } from 'config/AddBooking';
import { useEffect, useMemo } from 'react';

type NewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
  data: BookingItem[];
  dayTypeOptions: SelectOption[];
  onSaveBooking: () => void;
  updateModalTitle: (title: string) => void;
};
export default function PreviewNewBooking({
  formData,
  productionCode,
  data,
  dayTypeOptions,
  onSaveBooking,
  updateModalTitle,
}: NewBookingDetailsProps) {
  const venueDict = useRecoilValue(venueState);
  const production = useRecoilValue(currentProductionSelector);
  const distanceDict = useRecoilValue(distanceState);
  const milesWithVenueId = distanceDict[production.Id].stops.flatMap((item) =>
    item.option.map((optionItem) => ({
      VenueId: optionItem.VenueId,
      Miles: optionItem.Miles,
      Mins: optionItem.Mins,
    })),
  );

  const { rows: bookings } = useRecoilValue(rowsSelector);

  useEffect(() => {
    updateModalTitle('Preview New Booking');
  }, []);

  const filteredColumnDefs = useMemo(() => columnDefs.filter(({ field }) => field !== 'note'), []);

  const updateData: PreviewDataItem[] = data.map((item: any) => {
    const matchingMileage = milesWithVenueId.find((mileage) => mileage.VenueId === item.venue);
    const calculateWeek = () => {
      return calculateWeekNumber(new Date(production.StartDate), new Date(item.dateAsISOString));
    };
    return {
      ...item,
      color: true,
      venue: item.venue && item.dayType !== null ? venueDict[item.venue].Name : '',
      town: item.venue && item.dayType !== null ? venueDict[item.venue].Town : '',
      capacity: item.venue && item.dayType !== null ? venueDict[item.venue].Seats : null,
      dayType: dayTypeOptions.find((option) => option.value === item.dayType)?.text,
      production: productionCode.split(' ')[0],
      bookingStatus: bookingStatusMap[item.bookingStatus],
      status: item.bookingStatus,
      performanceCount: item.noPerf?.toString() || '',
      performanceTimes: item.times,
      week: calculateWeek(),
      Miles: matchingMileage ? matchingMileage.Miles : null,
      Mins: matchingMileage ? matchingMileage.Mins : null,
    };
  });

  const rowClassRules = {
    'custom-red-row': (params) => {
      const rowData = params.data;
      // Apply custom style if the 'color' property is true
      return rowData && rowData.color === true;
    },
  };

  const { fromDate, toDate } = formData;

  const sqlFromDate = toSql(fromDate);
  const sqlToDate = toSql(toDate);

  const pastStartDate = getDateDaysAgo(sqlFromDate, 6);

  const toDateSet = getDateDaysInFuture(sqlToDate, 1);
  const toDateBottomSet = moment(toDateSet).format('YYYY-MM-DD');

  const futureEndDate = getDateDaysInFuture(sqlToDate, 7);

  const pastStartDateP = moment(pastStartDate).format('YYYY-MM-DD');
  const pastStartDateF = moment(futureEndDate).format('YYYY-MM-DD');

  const filterBookingsByDateRange = (bookings, startDate, endDate) => {
    const filteredBookings = [];
    bookings.forEach((booking) => {
      const bookingDate = booking.dateTime;
      const bookingDateB = moment(bookingDate).format('YYYY-MM-DD');

      // Check if the booking date is within the specified range
      const isWithinRange = bookingDateB >= startDate && bookingDate <= endDate;

      if (isWithinRange) {
        // If the booking is within the range, push it to the new array
        filteredBookings.push(booking);
      }
    });
    const sortedFilteredBookings = filteredBookings.sort((a, b) => {
      const dateA: any = moment(a.dateTime).toDate();
      const dateB: any = moment(b.dateTime).toDate();

      return dateA - dateB;
    });

    return sortedFilteredBookings;
  };

  const filteredBookingsTop = filterBookingsByDateRange(bookings, pastStartDateP, sqlFromDate);

  const filteredBookingsBottom = filterBookingsByDateRange(bookings, toDateBottomSet, pastStartDateF);

  //   merge the filer data
  const mergedFilteredBookings = [...filteredBookingsTop, ...updateData, ...filteredBookingsBottom];

  const { goToStep } = useWizard();

  const previousStepFunc = () => {
    goToStep(steps.indexOf('New Booking Details'));
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      </div>
      <div className="w-[700px] lg:w-[1386px] h-full  z-[999] flex flex-col ">
        <Table
          rowData={mergedFilteredBookings}
          columnDefs={filteredColumnDefs}
          styleProps={styleProps}
          rowClassRules={rowClassRules}
        />

        <div className="pt-8 w-full flex justify-end  gap-3 float-right">
          <div className="flex gap-4">
            <Button className="w-33" variant="secondary" text="Back" onClick={previousStepFunc} />
            <Button className="w-33" text="Accept" onClick={onSaveBooking} />
          </div>
        </div>
      </div>
    </>
  );
}
