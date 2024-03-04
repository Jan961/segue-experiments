import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { useWizard } from 'react-use-wizard';
import { BookingItem, PreviewDataItem, TForm } from '../reducer';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import { getDateDaysAgo, getDateDaysInFuture, toSql , calculateWeekNumber } from 'services/dateService';
import moment from 'moment';
import { venueState } from 'state/booking/venueState';
import { bookingStatusMap } from 'config/bookings';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';

type NewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
  data: BookingItem[];
  dayTypeOptions: SelectOption[];
};
export default function PreviewNewBooking({ formData, productionCode, data, dayTypeOptions }: NewBookingDetailsProps) {
  const venueDict = useRecoilValue(venueState);
  const production = useRecoilValue(currentProductionSelector);

  const { rows: bookings } = useRecoilValue(rowsSelector);

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
    week: calculateWeekNumber(new Date(production.StartDate), new Date(item.date)),
  }));

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
    // return filteredBookings;
    return sortedFilteredBookings;
  };

  const filteredBookingsTop = filterBookingsByDateRange(bookings, pastStartDateP, sqlFromDate);

  const filteredBookingsBottom = filterBookingsByDateRange(bookings, sqlToDate, pastStartDateF);
  //   merge the filer data
  const mergedFilteredBookings = [...filteredBookingsTop, ...updateData, ...filteredBookingsBottom];

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
        <Table
          rowData={mergedFilteredBookings}
          columnDefs={columnDefs}
          styleProps={styleProps}
          rowClassRules={rowClassRules}
        />

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
