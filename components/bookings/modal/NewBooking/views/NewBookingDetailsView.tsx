// import NoPerfRenderEditor from 'components/bookings/table/NoPerfRenderEditor';
import { newBookingColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
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
import { dateToSimple, formattedDateWithWeekDay, getDateDaysAway, newDate } from 'services/dateService';
import { BookingWithVenueDTO, ProductionDTO } from 'interfaces';
import { venueState } from 'state/booking/venueState';
import { useRecoilValue } from 'recoil';
import { isNullOrEmpty } from 'utils';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';
import { Direction } from 'components/bookings/table/AddDeleteRowRenderer';
import axios from 'axios';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';
import MoveBooking from '../../moveBooking';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';

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
  onClose: (value?: string) => void;
  onDelete: () => void;
  onBarringCheckComplete: (nextStep: string) => void;
  updateModalTitle: (title: string) => void;
  isNewBooking: boolean;
  updateBarringConflicts: (barringConflicts: BarredVenue[]) => void;
  updateBookingConflicts: (bookingConflicts: BookingWithVenueDTO[]) => void;
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
  onBarringCheckComplete,
  updateBarringConflicts,
  updateBookingConflicts,
}: NewBookingDetailsProps) {
  const permissions = useRecoilValue(accessBookingsHome);
  const { fromDate, toDate, dateType, venueId, isRunOfDates } = formData;
  const venueDict = useRecoilValue(venueState);
  const [bookingData, setBookingData] = useState<BookingItem[]>([]);
  const [bookingRow, setBookingRow] = useState<BookingItem>(null);
  const [hasBookingChanged, setHasBookingChanged] = useState<boolean>(false);
  const [showMoveBookingModal, setShowMoveBookingsModal] = useState<boolean>(false);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [changeBookingLength, setchangeBookingLength] = useState<boolean>(false);
  const [changeBookingLengthConfirmed, setchangeBookingLengthConfirmed] = useState<boolean>(false);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const { goToStep } = useWizard();
  const tableRef = useRef(null);
  const confirmationType = useRef<ConfDialogVariant>('cancel');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [error, setError] = useState('');

  useEffect(() => {
    updateModalTitle(`${isNewBooking ? 'New' : 'Edit'} Booking Details`);
    onBarringCheckComplete('Preview New Booking');
  }, []);

  useEffect(() => {
    if (bookingData && tableRef.current) {
      // This is required after saving the note so the value gets updated on the grid
      tableRef.current.getApi()?.refreshCells({
        force: true,
      });
    }
  }, [bookingData]);

  const addRowToTable = (index: number, data: any, direction: Direction) => {
    const api = tableRef.current.getApi();
    const initRows = api.getRenderedNodes();
    if (initRows.length === 1) {
      initRows[0].data.isRunOfDates = true;
    }
    const rowDate =
      direction === 'before' ? getDateDaysAway(data.dateAsISOString, -1) : getDateDaysAway(data.dateAsISOString, 1);
    const date = formattedDateWithWeekDay(rowDate, 'Short');
    const dateAsISOString = rowDate.toISOString();
    const rowToAdd = { ...data, noPerf: null, times: '', date, dateAsISOString, id: null, isRunOfDates: true };
    applyTransactionToGrid(tableRef, { add: [rowToAdd], addIndex: direction === 'before' ? 0 : index + 1 });
    api.redrawRows();
  };

  const removeRowFromTable = (data: any) => {
    const api = tableRef.current.getApi();
    applyTransactionToGrid(tableRef, { remove: [data] });
    const rows = api.getRenderedNodes();
    if (rows.length === 1) {
      rows[0].data.isRunOfDates = false;
    }
    api.redrawRows();
  };

  useEffect(() => {
    if (isNewBooking) {
      let dayTypeOption = null;
      if (dayTypeOptions && venueOptions) {
        setColumnDefs(
          newBookingColumnDefs(
            dayTypeOptions,
            venueOptions,
            addRowToTable,
            removeRowFromTable,
            permissions.includes('ACCESS_BOOKING_NOTES'),
            changeBookingLength,
          ),
        );
        dayTypeOption = dayTypeOptions.find(({ value }) => value === dateType);
      }

      const isPerformance = dayTypeOption && dayTypeOption.text === 'Performance';
      const isRehearsal = dayTypeOption && dayTypeOption.text === 'Rehearsal';
      const isGetInFitUp = dayTypeOption && dayTypeOption.text === 'Get in / Fit Up';

      let startDate = newDate(fromDate);
      const endDate = newDate(toDate);
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
          dateAsISOString: startDate,
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
        startDate = getDateDaysAway(startDate, 1);
      }

      setBookingData(dates);
    }
  }, [fromDate, toDate, dateType, venueId, dayTypeOptions, venueOptions, dateBlockId, isRunOfDates, isNewBooking]);

  const productionItem = useMemo(() => {
    return {
      production: `${production?.ShowCode}${production?.Code}`,
      venue: bookingRow?.venue ? venueDict[bookingRow.venue].Name : '',
      date: bookingRow?.date || null,
      note: bookingRow?.notes || '',
    };
  }, [production, bookingRow, venueDict]);
  useEffect(() => {
    if (data !== null && data.length > 0) {
      setColumnDefs(
        newBookingColumnDefs(
          dayTypeOptions,
          venueOptions,
          addRowToTable,
          removeRowFromTable,
          permissions.includes('ACCESS_BOOKING_NOTES'),
          changeBookingLength,
        ),
      );
      setBookingData(data);
    }
  }, [data, dayTypeOptions, venueOptions, changeBookingLength]);

  const gridOptions = {
    getRowId: (params) => {
      return params.data.date;
    },
  };

  const checkForBarredVenues = async () => {
    const firstRow = tableRef.current.getApi().getDisplayedRowAtIndex(0);
    const lastRow = tableRef.current
      .getApi()
      .getDisplayedRowAtIndex(tableRef.current.getApi().getDisplayedRowCount() - 1);
    try {
      const response = await axios.post('/api/productions/venue/barringCheck', {
        startDate: firstRow.data.dateAsISOString,
        endDate: lastRow.data.dateAsISOString,
        productionId: production.Id,
        venueId: firstRow.data.venue,
        seats: 400,
        barDistance: 25,
        includeExcluded: false,
        filterBarredVenues: true,
      });
      if (!isNullOrEmpty(response.data)) {
        const formatted = response.data
          .map((barredVenue: BarredVenue) => ({ ...barredVenue, date: dateToSimple(barredVenue.date) }))
          .filter((venue: BarredVenue) => venue.hasBarringConflict);
        updateBarringConflicts(formatted);
        goToStep(getStepIndex(isNewBooking, 'Barring Issue'));
      } else {
        updateBarringConflicts(null);
        goToStep(getStepIndex(isNewBooking, 'Preview New Booking'));
      }
    } catch (e) {
      console.log('Error getting barred venues');
    }
  };

  const checkForBookingConflicts = async () => {
    const firstRow = tableRef.current.getApi().getDisplayedRowAtIndex(0);
    if (firstRow.data.venue) {
      const lastRow = tableRef.current
        .getApi()
        .getDisplayedRowAtIndex(tableRef.current.getApi().getDisplayedRowCount() - 1);
      try {
        const runTag = firstRow?.data?.runTag || '';
        const response = await axios.post('/api/bookings/conflict', {
          fromDate: firstRow.data.dateAsISOString,
          toDate: lastRow.data.dateAsISOString,
          productionId: production.Id,
          runTag,
        });
        if (!isNullOrEmpty(response.data)) {
          updateBookingConflicts(response.data);
          goToStep(getStepIndex(isNewBooking, 'Booking Conflict'));
        } else {
          setchangeBookingLengthConfirmed(true);
          setchangeBookingLength((prev) => !prev);
        }
      } catch (e) {
        console.log('Error getting barred venues');
      }
    } else {
      setchangeBookingLengthConfirmed(true);
      setchangeBookingLength((prev) => !prev);
    }
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
  const handleMoveBooking = () => {
    toggleModalOverlay(true);
    setShowMoveBookingsModal(true);
  };

  const handleCancelButtonClick = () => {
    if (changeBookingLength) {
      setBookingData([...data]);
      tableRef.current.getApi().redrawRows();
      setchangeBookingLength(false);
    } else {
      if (hasBookingChanged) {
        confirmationType.current = 'cancel';
        setShowConfirmation(true);
        toggleModalOverlay(true);
      } else {
        onClose();
      }
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

  const getRowData = () => {
    if (tableRef.current.getApi()) {
      const rowData = [];
      tableRef.current.getApi().forEachNode((node) => {
        rowData.push(node.data);
      });
      return rowData;
    }
    return [];
  };

  const validateBooking = (rowData: BookingItem[]) => {
    // Do not allow a performance booking to be changed to a non-performance booking
    const isPerformanceBooking = bookingData.some((row) => row.isBooking);
    if (isPerformanceBooking && !rowData.some((row) => row.isBooking)) {
      setError('Cannot change a performance booking to a non-performance booking');
      return false;
    }
    return true;
  };

  const storeBookingDetails = (rowData) => {
    setError(null);
    isNewBooking ? onSubmit(rowData) : onUpdate(rowData);
  };

  const handePreviewBookingClick = () => {
    const rowData = getRowData();
    if (!validateBooking(rowData)) {
      return;
    }
    storeBookingDetails(rowData);
    const firstRow = tableRef.current.getApi().getDisplayedRowAtIndex(0);
    if (firstRow.data.venue && formData.venueId !== firstRow.data.venue) {
      checkForBarredVenues();
    } else {
      goToStep(getStepIndex(isNewBooking, 'Preview New Booking'));
    }
  };

  const handeCheckMileageClick = () => {
    storeBookingDetails(getRowData());
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

  const handleChangeOrConfirmBooking = () => {
    if (changeBookingLength) {
      storeBookingDetails(getRowData());
      checkForBookingConflicts();
    } else {
      // The user has opted to change the length of the booking, so we need to make it a run of dates if it is not already one
      if (bookingData.length === 1) {
        setBookingData((prev) => [{ ...prev[0], isRunOfDates: true }]);
      }
      setchangeBookingLength((prev) => !prev);
    }
  };

  const handleMoveBookingClose = (value: string) => {
    setShowMoveBookingsModal(false);
    toggleModalOverlay(false);
    onClose(value);
  };

  const handleCellValueChange = () => {
    if (!hasBookingChanged) {
      setHasBookingChanged(true);
    }
  };

  return (
    <div
      className="w-[750px] lg:w-[950px] xl:w-[1450px] h-full flex flex-col "
      data-testid="edit-booking-model"
      tabIndex={1}
    >
      <Table
        testId="edit-booking-details-table"
        ref={tableRef}
        columnDefs={columnDefs}
        rowData={bookingData}
        styleProps={styleProps}
        onCellClicked={handleCellClick}
        onRowClicked={handleRowSelected}
        gridOptions={gridOptions}
        onCellValueChange={handleCellValueChange}
      />
      <NotesPopup
        testId="cnb-booking-details-tbl-notes"
        show={showNotesModal}
        productionItem={productionItem}
        onSave={handleSaveNote}
        onCancel={handleNotesCancel}
        disabled={!permissions.includes('EDIT_BOOKING_NOTES')}
      />
      <div className="pt-8 w-full flex items-end justify-between">
        <Button
          className="w-33 "
          text="Check Mileage"
          onClick={handeCheckMileageClick}
          disabled={!permissions.includes('ACCESS_MILEAGE_CHECK') || changeBookingLength}
        />
        <div className="flex flex-col justify-end  justify-items-end">
          {error && <span className="mb-3 text-right text-responsive-sm text-primary-red">{error}</span>}
          <div className="flex justify-end  justify-items-end gap-4">
            {isNewBooking && (
              <Button className="w-33" variant="secondary" text="Back" onClick={handleBackButtonClick} />
            )}
            <Button className="w-33 " variant="secondary" text="Cancel" onClick={handleCancelButtonClick} />
            {!isNewBooking && (
              <>
                <Button
                  className="w-33"
                  variant="tertiary"
                  text="Delete Booking"
                  onClick={handleDeleteBooking}
                  disabled={changeBookingLength || !permissions.includes('DELETE_BOOKING')}
                />
                <Button
                  className="w-33 "
                  variant="primary"
                  text="Move Booking"
                  onClick={handleMoveBooking}
                  disabled={
                    changeBookingLength || changeBookingLengthConfirmed || !permissions.includes('MOVE_BOOKING')
                  }
                />
                <Button
                  className="w-33 px-4"
                  variant="primary"
                  text={`${changeBookingLength ? 'Confirm New' : 'Change Booking'} Length`}
                  onClick={handleChangeOrConfirmBooking}
                  disabled={!permissions.includes('CHANGE_BOOKING_LENGTH')}
                />
              </>
            )}
            <Button
              className=" w-33"
              text="Preview Booking"
              onClick={handePreviewBookingClick}
              disabled={changeBookingLength}
            />
          </div>
        </div>
      </div>
      {showMoveBookingModal && (
        <MoveBooking
          visible={showMoveBookingModal}
          onClose={handleMoveBookingClose}
          bookings={bookingData}
          venueOptions={venueOptions}
        />
      )}
      <ConfirmationDialog
        variant={confirmationType.current}
        show={showConfirmation}
        onYesClick={handleYesClick}
        onNoClick={handleNoClick}
        hasOverlay={false}
      />
    </div>
  );
}
