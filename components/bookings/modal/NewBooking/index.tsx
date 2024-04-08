import PopupModal from 'components/core-ui-lib/PopupModal';
import { useRecoilValue } from 'recoil';
import { Wizard } from 'react-use-wizard';
import { AnimatePresence } from 'framer-motion';
import NewBookingView from './views/NewBookingView';
import BookingConflictsView from './views/BookingConflictsView';
import BarringIssueView from './views/BarringIssueView';
import { useMemo, useReducer, useState } from 'react';
import reducer, { BookingItem, TForm } from './reducer';
import { actionSpreader } from 'utils/AddBooking';
import { Actions, INITIAL_STATE, OTHER_DAY_TYPES } from 'config/AddBooking';
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
import axios from 'axios';
import { nanoid } from 'nanoid';

type AddBookingProps = {
  visible: boolean;
  onClose: (bookings?: any) => void;
  startDate?: string;
  endDate?: string;
};

const AddBooking = ({ visible, onClose, startDate, endDate }: AddBookingProps) => {
  const bookingDict = useRecoilValue(bookingState);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [hasOverlay, setHasOverlay] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, () => ({
    ...INITIAL_STATE,
    form: {
      ...INITIAL_STATE.form,
      fromDate: startDate,
      toDate: endDate,
    },
  }));

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
    setNewBookingOnStore(null);
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

  const setNewBookingOnStore = (booking: BookingItem[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BOOKING, booking));
  };

  const handleSaveNewBooking = async () => {
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

  return (
    <PopupModal
      show={visible}
      onClose={() => onClose()}
      titleClass="text-xl text-primary-navy text-bold"
      title={state.modalTitle}
      panelClass="relative"
      hasOverlay={hasOverlay}
    >
      <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
        <NewBookingView
          updateBookingConflicts={updateBookingConflicts}
          updateBarringConflicts={updateBarringConflicts}
          dayTypeOptions={dayTypeOptions}
          onChange={onFormDataChange}
          onSubmit={setNewBookingOnStore}
          formData={state.form}
          onClose={onClose}
          productionCode={productionCode}
          venueOptions={venueOptions}
          updateModalTitle={updateModalTitle}
        />
        <BookingConflictsView
          hasBarringIssues={state?.barringConflicts?.length > 0}
          data={state.bookingConflicts}
          updateModalTitle={updateModalTitle}
        />
        <BarringIssueView
          bookingConflicts={state.bookingConflicts}
          barringConflicts={state.barringConflicts}
          updateModalTitle={updateModalTitle}
        />
        <NewBookingDetailsView
          formData={state.form}
          data={state.booking}
          production={currentProduction}
          dateBlockId={primaryBlock?.Id}
          dayTypeOptions={dayTypeOptions}
          venueOptions={venueOptions}
          onSubmit={setNewBookingOnStore}
          toggleModalOverlay={(overlay) => setHasOverlay(overlay)}
          onClose={onClose}
          updateModalTitle={updateModalTitle}
        />
        <PreviewNewBookingView
          formData={state.form}
          productionCode={productionCode}
          data={state.booking}
          dayTypeOptions={dayTypeOptions}
          onSaveBooking={handleSaveNewBooking}
          updateModalTitle={updateModalTitle}
        />
        <CheckMileageView
          formData={state.form}
          productionCode={productionCode}
          data={state.booking}
          dayTypeOptions={dayTypeOptions}
          updateModalTitle={updateModalTitle}
          previousView={state.modalTitle}
        />
        <GapSuggestionView
          productionId={currentProduction?.Id}
          startDate={state.form.fromDate}
          endDate={state.form.toDate}
          updateModalTitle={updateModalTitle}
        />
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
