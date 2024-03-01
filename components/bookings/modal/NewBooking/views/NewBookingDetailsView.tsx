// import NoPerfRenderEditor from 'components/bookings/table/NoPerfRenderEditor';
import { newBookingColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { addDays } from 'date-fns';
import Table from 'components/core-ui-lib/Table';
import { useEffect, useRef, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { BookingItem, TForm } from '../reducer';
import NotesPopup from 'components/bookings/NotesPopup';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ColDef } from 'ag-grid-community';
import { steps } from 'config/AddBooking';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';

type NewBookingDetailsProps = {
  formData: TForm;
  dayTypeOptions: SelectOption[];
  productionCode: string;
  onSubmit: (booking: BookingItem[]) => void;
  toggleModalOverlay: (overlayStatus: boolean) => void;
  onClose: () => void;
};

const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];

export default function NewBookingDetailsView({
  formData,
  dayTypeOptions = [],
  productionCode,
  onSubmit,
  toggleModalOverlay,
  onClose,
}: NewBookingDetailsProps) {
  const { fromDate, toDate, dateType, venueId } = formData;
  const [bookingData, setBookingData] = useState<BookingItem[]>([]);
  const [bookingRow, setBookingRow] = useState<BookingItem>(null);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const { nextStep, goToStep } = useWizard();
  const tableRef = useRef(null);
  const confirmationType = useRef<ConfDialogVariant>('cancel');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

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
        noPerf: null,
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
      wrapHeaderText: true,
    },
    getRowId: (params) => {
      return params.data.date;
    },
  };

  const goToNewBooking = () => {
    goToStep(steps.indexOf('Create New Booking'));
  };

  const handleBackButtonClick = () => {
    const isDirty = tableRef.current.isDirty();
    if (isDirty) {
      confirmationType.current = 'leave';
      setShowConfirmation(true);
      toggleModalOverlay(true);
    } else {
      goToNewBooking();
    }
  };

  const handleCancelButtonClick = () => {
    const isDirty = tableRef.current.isDirty();
    if (isDirty) {
      confirmationType.current = 'cancel';
      setShowConfirmation(true);
      toggleModalOverlay(true);
    } else {
      onClose();
    }
  };

  const handleNoClick = () => {
    setShowConfirmation(false);
    toggleModalOverlay(false);
  };

  const handleYesClick = () => {
    setShowConfirmation(null);
    toggleModalOverlay(false);
    if (confirmationType.current === 'leave') {
      goToNewBooking();
    } else if (confirmationType.current === 'cancel') {
      onClose();
    }
  };

  const previewBooking = () => {
    if (tableRef.current.getApi()) {
      const rowData = [];
      tableRef.current.getApi().forEachNode((node) => {
        rowData.push(node.data);
      });
      onSubmit(rowData);
    }
  };

  const handleCellClick = (e) => {
    const { column, data } = e;
    if (column.colId === 'notes' && !Number.isNaN(data.venue) && data.dayType !== null) {
      setShowNotesModal(true);
      toggleModalOverlay(true);
    }
  };

  const handleRowSelected = ({ data }) => {
    setBookingRow(data);
  };

  const handleSaveNote = (value: string) => {
    setShowNotesModal(false);
    toggleModalOverlay(false);
    const updated = bookingData.map((booking) =>
      booking.date === bookingRow.date ? { ...bookingRow, notes: value } : booking,
    );
    setBookingData(updated);
  };

  const handleSaveBooking = () => {
    if (tableRef.current.getApi()) {
      const rowData = [];
      tableRef.current.getApi().forEachNode((node) => {
        rowData.push(node.data);
      });
    }
  };

  const handleNoteCancel = () => {
    setShowNotesModal(false);
    toggleModalOverlay(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      </div>
      <div className=" w-[700px] lg:w-[1154px] h-full flex flex-col ">
        <Table
          ref={tableRef}
          columnDefs={columnDefs}
          rowData={bookingData}
          styleProps={styleProps}
          gridOptions={gridOptions}
          onCellClicked={handleCellClick}
          onRowClicked={handleRowSelected}
        />
        <NotesPopup
          show={showNotesModal}
          productionItem={bookingRow}
          onSave={handleSaveNote}
          onCancel={handleNoteCancel}
        />
        <div className="pt-8 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
          <Button className=" w-33  place-self-start  " text="Check Mileage" onClick={() => nextStep()} />
          <div className="flex gap-4">
            <Button className="w-33" variant="secondary" text="Back" onClick={handleBackButtonClick} />
            <Button className="w-33 " variant="secondary" text="Cancel" onClick={handleCancelButtonClick} />
            <Button className=" w-33" text="Preview Booking" onClick={previewBooking} />
            <Button className=" w-33" text="Accept" onClick={handleSaveBooking} />
          </div>
        </div>
        <ConfirmationDialog
          variant={confirmationType.current}
          show={showConfirmation}
          onYesClick={handleYesClick}
          onNoClick={handleNoClick}
          hasOverlay={false}
        />
      </div>
    </>
  );
}
