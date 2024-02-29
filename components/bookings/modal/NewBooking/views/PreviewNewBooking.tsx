import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { TForm } from '../reducer';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import { getDateDaysAgo, getDateDaysInFuture, toSql } from 'services/dateService';
import moment from 'moment';
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
};
export default function PreviewNewBooking({ formData, productionCode }: NewBookingDetailsProps) {
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
    // const startDate = new Date(start);
    // const endDate = new Date(end);
    console.log('startDate-- :>> ', startDate);
    console.log('endDate-- :>> ', endDate);
    const filteredBookings = [];
    bookings.forEach((booking) => {
      const bookingDate = booking.dateTime;
      const bookingDateB = moment(bookingDate).format('YYYY-MM-DD');

      //   console.log('bookingDate :>> ', bookingDateB);

      // Check if the booking date is within the specified range
      const isWithinRange = bookingDateB >= startDate && bookingDate <= endDate;

      if (isWithinRange) {
        // If the booking is within the range, push it to the new array
        filteredBookings.push(booking);
      }
    });
    // console.log('filteredBookings :>> ', filteredBookings);
    return filteredBookings;
    // return bookings.filter((booking) => {
    //   const bookingDate = new Date(booking.date);
    //   // Check if the booking date is within the specified range

    //   return bookingDate >= startDate && bookingDate <= endDate;
    // });
  };

  const filteredBookings = filterBookingsByDateRange(bookings, pastStartDateP, pastStartDateF);

  console.log('filter booking ,,,', filteredBookings);

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
  const { nextStep, previousStep } = useWizard();
  const goToPreviousStep = () => {
    previousStep();
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      </div>
      <div className="w-[700px] lg:w-[1386px] h-full  z-[999] flex flex-col ">
        <Table rowData={filteredBookings} columnDefs={columnDefs} styleProps={styleProps} />

        <div className="py-8 w-full flex justify-end  gap-3 float-right">
          <div className="flex gap-4">
            <Button className="w-33" variant="secondary" text="Back" onClick={goToPreviousStep} />
            <Button className=" w-33  " text="Accept" onClick={() => nextStep()} />
          </div>
        </div>
      </div>
    </>
  );
}
