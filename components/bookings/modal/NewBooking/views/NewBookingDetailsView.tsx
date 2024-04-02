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
import { steps } from 'config/AddBooking';
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
  toggleModalOverlay: (isVisible: boolean) => void;
  onClose: () => void;
  updateModalTitle: (title: string) => void;
};

export default function NewBookingDetailsView({
  formData,
  dayTypeOptions = [],
  venueOptions = [],
  production,
  dateBlockId,
  data,
  onSubmit,
  toggleModalOverlay,
  onClose,
  updateModalTitle,
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
    updateModalTitle('New Booking Details');
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
  }, [fromDate, toDate, dateType, venueId, dayTypeOptions, venueOptions, dateBlockId, isRunOfDates]);

  const productionItem = useMemo(() => {
    return {
      production: `${production.ShowCode}${production.Code}`,
      venue: bookingRow?.venue ? venueDict[bookingRow.venue].Name : '',
      date: bookingRow?.date || null,
    };
  }, [production, bookingRow, venueDict]);

  useEffect(() => {
    if (data !== null && data.length > 0) {
      setBookingData(data);
    }
  }, [data]);

  const gridOptions = {
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
    setShowConfirmation(false);
    toggleModalOverlay(false);
    if (confirmationType.current === 'leave') {
      goToNewBooking();
    } else if (confirmationType.current === 'cancel') {
      onClose();
    }
  };

  const storeNewBookingDetails = () => {
    if (tableRef.current.getApi()) {
      const rowData = [];
      tableRef.current.getApi().forEachNode((node) => {
        rowData.push(node.data);
      });
      onSubmit(rowData);
    }
  };

  const handePreviewBookingClick = () => {
    storeNewBookingDetails();
    goToStep(steps.indexOf('Preview New Booking'));
  };

  const handeCheckMileageClick = () => {
    storeNewBookingDetails();
    goToStep(steps.indexOf('Check Mileage'));
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
            <Button className="w-33" variant="secondary" text="Back" onClick={handleBackButtonClick} />
            <Button className="w-33 " variant="secondary" text="Cancel" onClick={handleCancelButtonClick} />
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
