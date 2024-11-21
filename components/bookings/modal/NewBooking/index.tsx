import PopupModal from 'components/core-ui-lib/PopupModal';
import { useRecoilValue } from 'recoil';
import { Wizard } from 'react-use-wizard';
import { AnimatePresence } from 'framer-motion';
import NewBookingView from './views/NewBookingView';
import BookingConflictsView from './views/BookingConflictsView';
import BarringIssueView from './views/BarringIssueView';
import { useEffect, useMemo, useReducer, useState } from 'react';
import reducer, { BookingItem, TForm } from './reducer';
import { actionSpreader } from 'utils/AddBooking';
import { Actions, INITIAL_STATE, OTHER_DAY_TYPES, getStepIndex } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';
import GapSuggestionView from './views/GapSuggestionView';
import NewBookingDetailsView from './views/NewBookingDetailsView';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import PreviewNewBookingView from './views/PreviewBookingView';
import { dateTypeState } from 'state/booking/dateTypeState';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import CheckMileageView from './views/CheckMileageView';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';
import { bookingState } from 'state/booking/bookingState';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';
import { venueOptionsSelector } from 'state/booking/selectors/venueOptionsSelector';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { isNullOrEmpty } from 'utils';
import { BookingRow } from 'types/BookingTypes';

interface AddBookingProps {
  visible: boolean;
  onClose: (bookings?: any) => void;
  startDate?: string;
  endDate?: string;
  booking?: BookingRow;
  bookingInfo: BookingRow;
}

const AddBooking = ({ visible, onClose, startDate, endDate, bookingInfo, booking }: AddBookingProps) => {
  const bookingDict = useRecoilValue(bookingState);
  const { rows: bookings } = useRecoilValue(rowsSelector);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [hasOverlay, setHasOverlay] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, () => ({
    ...INITIAL_STATE,
    form: {
      ...INITIAL_STATE.form,
      fromDate: startDate,
      toDate: endDate,
      isRunOfDates: false,
    },
  }));

  const editBooking = !!booking;
  const currentProduction = useRecoilValue(currentProductionSelector);
  const { scheduleDateBlocks } = useRecoilValue(dateBlockSelector);
  const primaryBlock = scheduleDateBlocks?.find(({ IsPrimary }) => !!IsPrimary);
  const dayTypes = useRecoilValue(dateTypeState);
  const dayTypeOptions = useMemo(
    () =>
      [...OTHER_DAY_TYPES, ...dayTypes.map(({ Id: value, Name: text }) => ({ text, value }))].sort((a, b) =>
        a.text.localeCompare(b.text),
      ),
    [dayTypes],
  );

  const productionCode = useMemo(
    () =>
      currentProduction
        ? `${currentProduction?.ShowCode}${currentProduction?.Code} ${currentProduction?.ShowName}`
        : 'All',
    [currentProduction],
  );
  const currentProductionVenues = useMemo(
    () => Object.values(bookingDict).map((booking) => booking.VenueId),
    [bookingDict],
  );

  const venueOptions = useRecoilValue(
    venueOptionsSelector(state.form.shouldFilterVenues ? currentProductionVenues : []),
  );

  const onFormDataChange = (change: Partial<TForm>) => {
    dispatch(actionSpreader(Actions.UPDATE_FORM_DATA, change));
    setBookingOnStore(null);
  };
  const updateBookingConflicts = (bookingConflicts: BookingWithVenueDTO[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BOOKING_CONFLICTS, bookingConflicts));
  };
  const updateBarringConflicts = (barringConflicts: BarredVenue[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BARRED_VENUES, barringConflicts));
  };

  const updateModalTitle = (title: string) => {
    dispatch(actionSpreader(Actions.UPDATE_MODAL_TITLE, title));
  };

  const setBookingOnStore = (booking: BookingItem[]) => {
    dispatch(actionSpreader(Actions.SET_BOOKING, booking));
  };

  const updateBookingOnStore = (booking: BookingItem[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BOOKING, booking));
  };

  const resetBooking = () => {
    updateBookingOnStore(state.booking);
  };

  useEffect(() => {
    if (booking) {
      // Check for run of dates
      const runOfDates = bookings
        .filter(({ runTag }) => runTag === booking.runTag)
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      if (runOfDates.length > 1) {
        onFormDataChange({ isRunOfDates: true });
      }
      const bookingsToEdit = isNullOrEmpty(runOfDates) ? [booking] : runOfDates;
      // format booking and set on state
      const formattedBooking: BookingItem[] = bookingsToEdit.map((b: BookingRow) => {
        return {
          id: b.Id,
          date: b.date,
          dateAsISOString: b.dateTime,
          dateBlockId: primaryBlock?.Id,
          dayType: dayTypeOptions.find((option) => option.text === b.dayType)?.value,
          venue: b.venueId,
          runTag: b.runTag,
          perf: b.dayType === 'Performance',
          bookingStatus: b.status,
          notes: b.note,
          noPerf: b.performanceCount,
          times: b.performanceTimes,
          pencilNo: b.pencilNo,
          isBooking: b.dayType === 'Performance',
          isRehearsal: b.dayType === 'Rehearsal',
          isGetInFitUp: b.dayType === 'Get in / Fit Up',
          isRunOfDates: runOfDates.length > 1,
        };
      });
      dispatch(actionSpreader(Actions.UPDATE_FORM_DATA, { venueId: formattedBooking[0].venue }));
      setBookingOnStore(formattedBooking);
      updateBookingOnStore(formattedBooking);
    }
  }, [booking]);

  const saveNewBooking = async () => {
    const runTagForRunOfDates = nanoid(8);
    try {
      const bookingsWithRunTag = state.booking.map((b) => ({
        ...b,
        runTag: state.form.isRunOfDates ? runTagForRunOfDates : nanoid(8),
      }));
      const { data } = await axios.post('/api/bookings/add', bookingsWithRunTag);
      onClose(data);
    } catch (e) {
      console.log('Failed to add new booking', e);
    }
  };

  const deleteBooking = async () => {
    try {
      const { data } = await axios.post('/api/bookings/delete', state.booking);
      onClose(data);
    } catch (e) {
      console.log('Failed to delete booking', e);
    }
  };

  const updateBooking = async () => {
    try {
      const runTag = state.form.isRunOfDates ? state.booking[0].runTag : nanoid(8);
      const bookingsUpdatedWithRunTag = state.bookingUpdates.map((b) => (!b.runTag ? { ...b, runTag } : b));
      const { data: updated } = await axios.post(
        `${state.form.isRunOfDates ? '/api/bookings/update-run-of-dates' : '/api/bookings/update'}`,
        {
          original: state.booking,
          updated: bookingsUpdatedWithRunTag,
        },
      );
      onClose(updated);
    } catch (e) {
      console.log('Failed to update booking', e);
    }
  };

  const handleSaveBooking = async () => {
    editBooking ? await updateBooking() : await saveNewBooking();
  };

  const handleBarringCheckComplete = (nextStep: string) => {
    dispatch(actionSpreader(Actions.SET_BARRING_NEXT_STEP, nextStep));
  };

  const nextStepForConflicts = useMemo(() => {
    const hasBarringIssues = state?.barringConflicts?.length > 0;
    return getStepIndex(!editBooking, hasBarringIssues ? 'Barring Issue' : 'New Booking Details');
  }, [state.barringConflicts, editBooking]);
  return (
    <PopupModal
      show={visible}
      onClose={() => onClose()}
      titleClass="text-xl text-primary-navy text-bold"
      title={state.modalTitle}
      panelClass="relative"
      hasOverlay={hasOverlay}
      subtitle={productionCode}
    >
      <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
        {!editBooking && (
          <NewBookingView
            updateBookingConflicts={updateBookingConflicts}
            updateBarringConflicts={updateBarringConflicts}
            dayTypeOptions={dayTypeOptions}
            onChange={onFormDataChange}
            onSubmit={setBookingOnStore}
            formData={state.form}
            onClose={onClose}
            venueOptions={venueOptions}
            updateModalTitle={updateModalTitle}
            onBarringCheckComplete={handleBarringCheckComplete}
          />
        )}
        <NewBookingDetailsView
          isNewBooking={!editBooking}
          formData={state.form}
          data={editBooking ? state.bookingUpdates : state.booking}
          production={currentProduction}
          dateBlockId={primaryBlock?.Id}
          dayTypeOptions={dayTypeOptions}
          venueOptions={venueOptions}
          onSubmit={setBookingOnStore}
          onUpdate={updateBookingOnStore}
          toggleModalOverlay={(overlay) => setHasOverlay(overlay)}
          onClose={onClose}
          onDelete={deleteBooking}
          updateModalTitle={updateModalTitle}
          onBarringCheckComplete={handleBarringCheckComplete}
          updateBarringConflicts={updateBarringConflicts}
          updateBookingConflicts={updateBookingConflicts}
        />
        <PreviewNewBookingView
          formData={state.form}
          productionCode={productionCode}
          originalRows={state.booking}
          updatedRows={state.bookingUpdates}
          dayTypeOptions={dayTypeOptions}
          onSaveBooking={handleSaveBooking}
          updateModalTitle={updateModalTitle}
          isNewBooking={!editBooking}
        />
        <CheckMileageView
          isNewBooking={!editBooking}
          formData={state.form}
          productionCode={productionCode}
          originalRows={state.booking}
          updatedRows={state.bookingUpdates}
          dayTypeOptions={dayTypeOptions}
          updateModalTitle={updateModalTitle}
          previousView={state.modalTitle}
        />
        <BookingConflictsView
          isNewBooking={!editBooking}
          data={state.bookingConflicts}
          nextStep={nextStepForConflicts}
          updateModalTitle={updateModalTitle}
          onResetBooking={resetBooking}
        />
        <BarringIssueView
          barringConflicts={state.barringConflicts}
          updateModalTitle={updateModalTitle}
          previousStep={getStepIndex(!editBooking, !editBooking ? 'Create New Booking' : 'New Booking Details')}
          nextStep={getStepIndex(!editBooking, state.barringNextStep)}
          onResetBooking={resetBooking}
        />
        {!editBooking && (
          <GapSuggestionView
            booking={bookingInfo}
            productionId={currentProduction?.Id}
            startDate={state.form.fromDate}
            endDate={state.form.toDate}
            updateModalTitle={updateModalTitle}
          />
        )}
      </Wizard>
      <ConfirmationDialog
        variant="close"
        show={!!showConfirmation}
        onYesClick={onClose}
        onNoClick={() => setShowConfirmation(false)}
        hasOverlay={false}
      />
    </PopupModal>
  );
};

export default AddBooking;
