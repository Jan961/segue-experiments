// import NoPerfRenderEditor from 'components/bookings/table/NoPerfRenderEditor';
import { newBookingColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { addDays } from 'date-fns';
import Table from 'components/core-ui-lib/Table';
import { useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { TForm } from '../reducer';
import { steps } from 'config/AddBooking';
import NotesPopup from 'components/bookings/NotesPopup';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ColDef } from 'ag-grid-community';

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
  dayTypeOptions: SelectOption[];
  productionCode: string;
};

const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];

export default function NewBookingDetailsView({
  formData,
  dayTypeOptions = [],
  productionCode,
}: NewBookingDetailsProps) {
  const { fromDate, toDate, dateType, venueId } = formData;
  const [bookingData, setBookingData] = useState<BookingDataItem[]>([]);
  const [bookingRow, setBookingRow] = useState<BookingDataItem>(null);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const { nextStep, previousStep, goToStep } = useWizard();

  useEffect(() => {
    let dayTypeOption = null;
    if (dayTypeOptions) {
      setColumnDefs(newBookingColumnDefs(dayTypeOptions));
      dayTypeOption = dayTypeOptions.find(({ value }) => value === dateType);
    }

    const isPerformance = dayTypeOption && dayTypeOption.text === 'Performance';
    const isFiltered = dayTypeOption && DAY_TYPE_FILTERS.includes(dayTypeOption.text);
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
        perf: isPerformance,
        dayType: dateType,
        venue: venueId,
        noPerf: 0,
        times: '',
        bookingStatus: isFiltered ? 'U' : '', // U for Pencilled
        pencilNo: '',
        notes: '',
        isBooking: false,
        isRehearsal: false,
        isGetInFitUp: false,
      };
      dates.push(dateObject);
      // Increment currentDate by one day for the next iteration
      startDate = addDays(startDate, 1);
    }
    setBookingData(dates);
  }, [fromDate, toDate, dateType, venueId, dayTypeOptions]);

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

  const PreviewBooking = () => {
    console.table(bookingData);
    goToStep(steps.indexOf('Preview New Booking'));
  };

  const handleCellClick = (e) => {
    console.log(e);
    setBookingRow(e.data);
    if (e.column.colId === 'notes') {
      setShowNotesModal(true);
    }
  };

  const handleSaveNote = (value: string) => {
    setShowNotesModal(false);
    const updated = bookingData.map((booking) =>
      booking.date === bookingRow.date ? { ...bookingRow, notes: value } : booking,
    );
    setBookingData(updated);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      </div>
      <div className=" w-[700px] lg:w-[1154px] h-full flex flex-col ">
        <Table
          columnDefs={columnDefs}
          rowData={bookingData}
          styleProps={styleProps}
          gridOptions={gridOptions}
          onCellClicked={handleCellClick}
        />
        <NotesPopup
          show={showNotesModal}
          productionItem={bookingRow}
          onSave={handleSaveNote}
          onCancel={() => setShowNotesModal(false)}
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
