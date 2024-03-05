import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { BookingItem, PreviewDataItem, TForm } from '../reducer';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import { calculateWeekNumber, getDateDaysAgo, getDateDaysInFuture, toSql } from 'services/dateService';
import moment from 'moment';
import { venueState } from 'state/booking/venueState';
import { distanceState } from 'state/booking/distanceState';
import { bookingStatusMap } from 'config/bookings';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { steps } from 'config/AddBooking';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';

type NewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
  data: BookingItem[];
  dayTypeOptions: SelectOption[];
};
export default function MileageBooking({ formData, productionCode, data, dayTypeOptions }: NewBookingDetailsProps) {
  const venueDict = useRecoilValue(venueState);
  const production = useRecoilValue(currentProductionSelector);
  const distanceDict = useRecoilValue(distanceState);
  const { rows: bookings } = useRecoilValue(rowsSelector);

  const milesWithVenueId = distanceDict[22].stops.flatMap((item) =>
    item.option.map((optionItem) => ({
      VenueId: optionItem.VenueId,
      Miles: optionItem.Miles,
      Mins: optionItem.Mins,
    })),
  );

  const updateData: PreviewDataItem[] = data.map((item: any) => {
    // Find the matching mileage for the venue in data
    const matchingMileage = milesWithVenueId.find((mileage) => mileage.VenueId === item.venue);

    return {
      ...item,
      color: true,
      venue: venueDict[item.venue].Name,
      town: venueDict[item.venue].Town,
      capacity: venueDict[item.venue].Seats,
      dayType: dayTypeOptions.find((option) => option.value === item.dayType)?.text,
      production: productionCode.split(' ')[0],
      bookingStatus: bookingStatusMap[item.bookingStatus],
      status: item.bookingStatus,
      performanceCount: item.noPerf?.toString() || '',
      performanceTimes: item.times,
      week: calculateWeekNumber(new Date(production.StartDate), new Date(item.date)),
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

  const pastStartDate = getDateDaysAgo(sqlFromDate, 5);
  // future date is set according to condition
  const isSameDate = fromDate === toDate;
  // If the dates are the same, add 2 days to toDateSet, otherwise add 1 day
  const daysToAdd = isSameDate ? 2 : 1;
  const daysToFu = isSameDate ? 7 : 6;

  const toDateSet = getDateDaysInFuture(sqlToDate, daysToAdd);
  const toDateM = moment(toDateSet).format('YYYY-MM-DD');

  const futureEndDate = getDateDaysInFuture(sqlToDate, daysToFu);

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
  const filteredBookingsBottom = filterBookingsByDateRange(bookings, toDateM, pastStartDateF);
  const mergedFilteredBookings = [...filteredBookingsTop, ...updateData, ...filteredBookingsBottom];
  console.log('mergedFilteredBookings :>> ', mergedFilteredBookings);

  const { goToStep } = useWizard();
  const goToNewBookingDetail = () => {
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
          columnDefs={columnDefs}
          styleProps={styleProps}
          rowClassRules={rowClassRules}
        />

        <div className="pt-8 w-full flex justify-end  gap-3 float-right">
          <div className="flex gap-4">
            <Button className=" w-33  " text="Close" onClick={() => goToNewBookingDetail()} />
          </div>
        </div>
      </div>
    </>
  );
}
