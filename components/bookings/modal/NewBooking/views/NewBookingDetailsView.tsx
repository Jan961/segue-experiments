// import NoPerfRenderEditor from 'components/bookings/table/NoPerfRenderEditor';
import { NewBookingColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { addDays } from 'date-fns';
import Table from 'components/core-ui-lib/Table';
import { useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { TForm } from '../reducer';
import { steps } from 'config/AddBooking';

type BookingDataItem = {
  date?: string;
  perf?: boolean;
  dayType?: string;
  venue?: number;
  noPerf?: number;
  times?: string;
  bookingStatus?: string;
  pencilNo?: number;
  notes?: string;
  isBooking?: boolean;
  isRehearsal?: boolean;
  isGetInFitUp?: boolean;
};
type NewBookingDetailsProps = {
  formData: TForm;
  productionCode: string;
};

export default function NewBookingDetailsView({ formData, productionCode }: NewBookingDetailsProps) {
  const { fromDate, toDate, dateType, venueId } = formData;
  const [bookingData, setBookingData] = useState<BookingDataItem[]>([]);
  useEffect(() => {
    let startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const dates = [];

    while (startDate <= endDate) {
      const formattedDate = `${startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })}`.replace(',', ' ');

      const reorderedDate = formattedDate.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3');

      const dateObject = {
        date: reorderedDate,
        perf: false, // Set your default values
        dayType: dateType,
        venue: venueId,
        noPerf: 0,
        times: '',
        bookingStatus: '',
        pencilNo: '',
        notes: '',
        isBooking: false,
        isRehearsal: false,
        isGetInFitUp: false,
      };
      dates.push(dateObject);
      // console.log('formattedDate  reorderedDate...:>> ', reorderedDate);

      // Increment currentDate by one day for the next iteration
      startDate = addDays(startDate, 1);
    }
    setBookingData(dates);
  }, [fromDate, toDate]);

  const { nextStep, previousStep, goToStep } = useWizard();

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
      editable: true,
      wrapHeaderText: true,
    },
    getRowId: (params) => {
      return params.data.date;
    },
  };
  const goToPreviousStep = () => {
    previousStep();
  };
  // const handleCellClick = (e) => {
  //   if (e.column.colId === 'note') {
  //     setProductionItem(e.data);
  //     setShowModal(true);
  //   }
  // };

  const PreviewBooking = () => {
    console.table(bookingData);
    goToStep(steps.indexOf('Preview New Booking'));
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      </div>
      <div className=" w-[700px] lg:w-[1154px] h-full flex flex-col ">
        <Table
          columnDefs={NewBookingColumnDefs}
          rowData={bookingData}
          styleProps={styleProps}
          gridOptions={gridOptions}
        />

        <div className="py-8 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
          <Button className=" w-33  place-self-start  " text="Check Mileage" onClick={() => nextStep()} />
          <div className="flex gap-4">
            <Button className="w-33" variant="secondary" text="Back" onClick={goToPreviousStep} />
            <Button className="w-33 " variant="secondary" text="Cancel" onClick={close} />
            <Button className=" w-33" text="Preview Booking" onClick={() => PreviewBooking()} />
          </div>
        </div>
      </div>
    </>
  );
}
