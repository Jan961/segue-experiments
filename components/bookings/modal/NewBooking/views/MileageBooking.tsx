import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { BookingItem, PreviewDataItem, TForm } from '../reducer';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import { getDateDaysAgo, getDateDaysInFuture, toSql } from 'services/dateService';
import moment from 'moment';
import { venueState } from 'state/booking/venueState';
// import { distanceState } from 'state/booking/distanceState';
import { bookingStatusMap } from 'config/bookings';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { steps } from 'config/AddBooking';

type NewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
  data: BookingItem[];
  dayTypeOptions: SelectOption[];
};
export default function MileageBooking({ formData, productionCode, data, dayTypeOptions }: NewBookingDetailsProps) {
  const venueDict = useRecoilValue(venueState);
  //   const distanceDict = useRecoilValue(distanceState);

  const updateData: PreviewDataItem[] = data.map((item: any) => ({
    ...item,
    color: true,
    venue: venueDict[item.venue].Name,
    town: venueDict[item.venue].Town,
    dayType: dayTypeOptions.find((option) => option.value === item.dayType)?.text,
    production: productionCode.split(' ')[0],
    bookingStatus: bookingStatusMap[item.bookingStatus],
    status: item.bookingStatus,
    performanceCount: item.noPerf?.toString() || '',
    performanceTimes: item.times,
  }));

  const { rows: bookings } = useRecoilValue(rowsSelector);

  const { fromDate, toDate } = formData;

  const sqlFromDate = toSql(fromDate);
  const sqlToDate = toSql(toDate);

  const pastStartDate = getDateDaysAgo(sqlFromDate, 5);
  const futureEndDate = getDateDaysInFuture(sqlToDate, 5);

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
  const filteredBookingsBottom = filterBookingsByDateRange(bookings, sqlToDate, pastStartDateF);
  const mergedFilteredBookings = [...filteredBookingsTop, ...updateData, ...filteredBookingsBottom];

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
        <Table rowData={mergedFilteredBookings} columnDefs={columnDefs} styleProps={styleProps} />

        <div className="py-8 w-full flex justify-end  gap-3 float-right">
          <div className="flex gap-4">
            <Button className=" w-33  " text="Close" onClick={() => goToNewBookingDetail()} />
          </div>
        </div>
      </div>
    </>
  );
}