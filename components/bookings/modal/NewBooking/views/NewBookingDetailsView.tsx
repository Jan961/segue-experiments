// import NoPerfRenderEditor from 'components/bookings/table/NoPerfRenderEditor';
import { newBookingColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import { addDays } from 'date-fns';
import Table from 'components/core-ui-lib/Table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { BookingItem, TForm } from '../reducer';
import NotesPopup from 'components/bookings/NotesPopup';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ColDef } from 'ag-grid-community';
import { getStepIndex } from 'config/AddBooking';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { toISO } from 'services/dateService';
import { ProductionDTO } from 'interfaces';
import { venueState } from 'state/booking/venueState';
import { useRecoilValue } from 'recoil';
import { isNullOrEmpty } from 'utils';

type NewBookingDetailsProps = {
  formData: TForm;
  data: BookingItem[];
  dayTypeOptions: SelectOption[];
  venueOptions: SelectOption[];
  production: Partial<ProductionDTO>;
  dateBlockId: number;
  onSubmit: (booking: BookingItem[]) => void;
  onUpdate: (booking: BookingItem[]) => void;
  toggleModalOverlay: (isVisible: boolean) => void;
  onClose: () => void;
  onDelete: () => void;
  updateModalTitle: (title: string) => void;
  isNewBooking: boolean;
};

export default function NewBookingDetailsView({
  formData,
  dayTypeOptions = [],
  venueOptions = [],
  production,
  dateBlockId,
  data,
  onSubmit,
  onUpdate,
  onDelete,
  toggleModalOverlay,
  onClose,
  updateModalTitle,
  isNewBooking,
}: NewBookingDetailsProps) {
  const { fromDate, toDate, dateType, venueId, isRunOfDates } = formData;
  const venueDict = useRecoilValue(venueState);
  const [bookingData, setBookingData] = useState<BookingItem[]>([]);
  const [bookingRow, setBookingRow] = useState<BookingItem>(null);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const { goToStep } = useWizard();
  const tableRef = useRef(null);
  const confirmationType = useRef<ConfDialogVariant>('cancel');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    updateModalTitle(`${isNewBooking ? 'New' : 'Edit'} Booking Details`);
  }, []);

  useEffect(() => {
    if (bookingData && tableRef.current) {
      // This is required afyer saving the note so the value gets updated on the grid
      tableRef.current.getApi()?.refreshCells({
        force: true,
      });
    }
  }, [bookingData]);

  useEffect(() => {
    if (isNewBooking) {
      let dayTypeOption = null;
      if (dayTypeOptions && venueOptions) {
        setColumnDefs(newBookingColumnDefs(dayTypeOptions, venueOptions));
        dayTypeOption = dayTypeOptions.find(({ value }) => value === dateType);
      }

      const isPerformance = dayTypeOption && dayTypeOption.text === 'Performance';
      const isRehearsal = dayTypeOption && dayTypeOption.text === 'Rehearsal';
      const isGetInFitUp = dayTypeOption && dayTypeOption.text === 'Get in / Fit Up';

      let startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const dates = [];
      while (startDate <= endDate) {
        const formattedDate = `${startDate.toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })}`.replace(',', '');

        const reorderedDate = formattedDate.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3');

        const dateObject = {
          dateBlockId,
          date: reorderedDate,
          dateAsISOString: toISO(startDate),
          perf: isPerformance,
          dayType: dateType,
          venue: venueId,
          noPerf: null,
          times: '',
          bookingStatus: dateType !== null ? 'U' : '', // U for Pencilled
          pencilNo: '',
          notes: '',
          isBooking: isPerformance,
          isRehearsal,
          isGetInFitUp,
          isRunOfDates,
        };

        dates.push(dateObject);
        // Increment currentDate by one day for the next iteration
        startDate = addDays(startDate, 1);
      }

      setBookingData(dates);
    }
  }, [fromDate, toDate, dateType, venueId, dayTypeOptions, venueOptions, dateBlockId, isRunOfDates, isNewBooking]);

  const productionItem = useMemo(() => {
    return {
      production: `${production.ShowCode}${production.Code}`,
      venue: bookingRow?.venue ? venueDict[bookingRow.venue].Name : '',
      date: bookingRow?.date || null,
      note: bookingRow?.notes || '',
    };
  }, [production, bookingRow, venueDict]);

  useEffect(() => {
    if (data !== null && data.length > 0) {
      setColumnDefs(newBookingColumnDefs(dayTypeOptions, venueOptions));
      setBookingData(data);
    }
  }, [data, dayTypeOptions, venueOptions]);

  const gridOptions = {
    getRowId: (params) => {
      return params.data.date;
    },
  };

  const goToNewBooking = () => {
    goToStep(getStepIndex(isNewBooking, 'Create New Booking'));
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

  const handleDeleteBooking = () => {
    confirmationType.current = 'delete';
    setShowConfirmation(true);
    toggleModalOverlay(true);
  };

  // Placeholder function to be implemented
  const handleMoveBooking = () => null;

  // Placeholder function to be implemented
  const handleChangeBookingLength = () => null;

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
    setShowConfirmation(false);
    toggleModalOverlay(false);
    if (confirmationType.current === 'leave') {
      goToNewBooking();
    } else if (confirmationType.current === 'cancel') {
      onClose();
    } else if (confirmationType.current === 'delete') {
      onDelete();
    }
  };

  const storeNewBookingDetails = () => {
    if (tableRef.current.getApi()) {
      const rowData = [];
      tableRef.current.getApi().forEachNode((node) => {
        rowData.push(node.data);
      });

      isNewBooking ? onSubmit(rowData) : onUpdate(rowData);
    }
  };

  const handePreviewBookingClick = () => {
    storeNewBookingDetails();
    goToStep(getStepIndex(isNewBooking, 'Preview New Booking'));
  };

  const handeCheckMileageClick = () => {
    storeNewBookingDetails();
    goToStep(getStepIndex(isNewBooking, 'Check Mileage'));
  };

  const handleCellClick = (e) => {
    const { column, data } = e;

    if (column.colId === 'notes' && !Number.isNaN(data.venue) && !isNullOrEmpty(data.dayType)) {
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

    if (formData.isRunOfDates) {
      const rowNodes = [];
      tableRef.current.getApi().forEachNode(({ data }) => {
        rowNodes.push({ ...data, notes: value });
      });
      setBookingData(rowNodes);
    } else {
      const updated = bookingData.map((booking) =>
        booking.date === bookingRow.date ? { ...bookingRow, notes: value } : booking,
      );
      setBookingData(updated);
    }
  };

  const handleNotesCancel = () => {
    setShowNotesModal(false);
    toggleModalOverlay(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{`${production.ShowCode}${production.Code}  ${production?.ShowName}`}</div>
      </div>
      <div className=" w-[750px] lg:w-[1450px] h-full flex flex-col ">
        <Table
          ref={tableRef}
          columnDefs={columnDefs}
          rowData={bookingData}
          styleProps={styleProps}
          onCellClicked={handleCellClick}
          onRowClicked={handleRowSelected}
          gridOptions={gridOptions}
        />
        <NotesPopup
          show={showNotesModal}
          productionItem={productionItem}
          onSave={handleSaveNote}
          onCancel={handleNotesCancel}
        />
        <div className="pt-8 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
          <Button className=" w-33  place-self-start  " text="Check Mileage" onClick={handeCheckMileageClick} />
          <div className="flex gap-4">
            {isNewBooking && (
              <Button className="w-33" variant="secondary" text="Back" onClick={handleBackButtonClick} />
            )}
            <Button className="w-33 " variant="secondary" text="Cancel" onClick={handleCancelButtonClick} />
            {!isNewBooking && (
              <>
                <Button className="w-33 " variant="tertiary" text="Delete Booking" onClick={handleDeleteBooking} />
                <Button className="w-33 " variant="primary" text="Move Booking" onClick={handleMoveBooking} />
                <Button
                  className="w-33 px-4"
                  variant="primary"
                  text="Change Booking Length"
                  onClick={handleChangeBookingLength}
                />
              </>
            )}
            <Button className=" w-33" text="Preview Booking" onClick={handePreviewBookingClick} />
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
