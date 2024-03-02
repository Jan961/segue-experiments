import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { BookingItem, TForm } from '../reducer';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import { getDateDaysAgo, getDateDaysInFuture, toSql } from 'services/dateService';
import moment from 'moment';
import { venueState } from 'state/booking/venueState';
// import { dateTypeState } from 'state/booking/dateTypeState';
import { distanceState } from 'state/booking/distanceState';
import { bookingStatusMap } from 'config/bookings';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { steps } from 'config/AddBooking';
// type PreviewDataItem = {
//   production: string;
//   date: string;
//   week: string;
//   venue: number;
//   town: string;
//   perf: boolean;
//   dayType: string;
//   bookingStatus: string;
//   capacity: number;
//   noPerf: number;
//   perfTimes: string;
//   miles: string;
//   travelTime: string;
// };
type NewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
  data: BookingItem;
  dayTypeOptions: SelectOption[];
};
export default function MileageBooking({ formData, productionCode, data, dayTypeOptions }: NewBookingDetailsProps) {
  const venueDict = useRecoilValue(venueState);
  const distanceDict = useRecoilValue(distanceState);
  console.log('distanceDict :>> ', distanceDict);
  console.log('venueDict :>> ', venueDict);
  const updateData = data.map((item: any) => ({
    ...item,

    venue: venueDict[item.venue].Name,
    town: venueDict[item.venue].Town,
    dayType: dayTypeOptions.find((option) => option.value === item.dayType)?.text,
    production: productionCode.split(' ')[0],
    bookingStatus: bookingStatusMap[item.bookingStatus],
    status: item.bookingStatus,
    performanceCount: item.noPerf?.toString() || '',
    performanceTimes: item.times,
  }));
  console.log('updateData :>> ', updateData);

  console.log('data :>> ', data);
  const { rows: bookings } = useRecoilValue(rowsSelector);

  console.log('rows selector :>> ', bookings);
  console.log('data to preview booking :>> ', formData);
  const { fromDate, toDate } = formData;

  const sqlFromDate = toSql(fromDate);
  const sqlToDate = toSql(toDate);
  console.log('sqlFromDate :>> ', sqlFromDate);
  console.log('sqlToDate :>> ', sqlToDate);
  const pastStartDate = getDateDaysAgo(sqlFromDate, 5);
  const futureEndDate = getDateDaysInFuture(sqlToDate, 5);

  const pastStartDateP = moment(pastStartDate).format('YYYY-MM-DD');
  const pastStartDateF = moment(futureEndDate).format('YYYY-MM-DD');
  console.log('pastStartDate,,, :>> ', pastStartDateP);
  console.log('Future End Date:,,,', pastStartDateF);

  const filterBookingsByDateRange = (bookings, startDate, endDate) => {
    console.log('startDate-- :>> ', startDate);
    console.log('endDate-- :>> ', endDate);
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
    // return filteredBookings;
    return sortedFilteredBookings;
  };

  const filteredBookingsTop = filterBookingsByDateRange(bookings, pastStartDateP, sqlFromDate);
  const filteredBookingsBottom = filterBookingsByDateRange(bookings, sqlToDate, pastStartDateF);
  const mergedFilteredBookings = [...filteredBookingsTop, ...updateData, ...filteredBookingsBottom];

  console.log('filter booking ,,,', filteredBookingsTop);
  console.log('filteredBookingsBottom :>> ', filteredBookingsBottom);
  console.log('mergedFilteredBookings :>> ', mergedFilteredBookings);

  //   const dummyData: PreviewDataItem[] = [
  //     {
  //       production: '1',
  //       date: '2024-01-01',
  //       week: 'Week 1',
  //       venue: 1,
  //       town: 'City 1',
  //       perf: true,
  //       dayType: 'Performance',
  //       bookingStatus: 'Confirmed',
  //       capacity: 1000,
  //       noPerf: 2,
  //       perfTimes: '7:00 PM - 9:00 PM',
  //       miles: '50',
  //       travelTime: '1 hour',
  //     },
  //     {
  //       production: '2',
  //       date: '2024-01-02',
  //       week: 'Week 1',
  //       venue: 2,
  //       town: 'City 2',
  //       perf: false,
  //       dayType: 'Rehearsal',
  //       bookingStatus: 'Pending',
  //       capacity: 800,
  //       noPerf: 0,
  //       perfTimes: '',
  //       miles: '30',
  //       travelTime: '45 minutes',
  //     },
  //     {
  //       production: '3',
  //       date: '2024-01-03',
  //       week: 'Week 1',
  //       venue: 3,
  //       town: 'City 3',
  //       perf: true,
  //       dayType: 'Performance',
  //       bookingStatus: 'Confirmed',
  //       capacity: 1200,
  //       noPerf: 1,
  //       perfTimes: '6:30 PM - 8:30 PM',
  //       miles: '40',
  //       travelTime: '50 minutes',
  //     },
  //     {
  //       production: '4',
  //       date: '2024-01-04',
  //       week: 'Week 1',
  //       venue: 4,
  //       town: 'City 4',
  //       perf: false,
  //       dayType: 'Travel Day',
  //       bookingStatus: 'Confirmed',
  //       capacity: 900,
  //       noPerf: 0,
  //       perfTimes: '',
  //       miles: '60',
  //       travelTime: '1.5 hours',
  //     },
  //     // Add more dummy data as needed
  //   ];
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
