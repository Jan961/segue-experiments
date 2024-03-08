import PopupModal from 'components/core-ui-lib/PopupModal';
import { useRecoilValue } from 'recoil';
import { Wizard } from 'react-use-wizard';
import { AnimatePresence } from 'framer-motion';
import NewBookingView from './views/NewBookingView';
import BookingConflictsView from './views/BookingConflictsView';
import { newBookingState } from 'state/booking/newBookingState';
import BarringIssueView from './views/BarringIssueView';
import { useEffect, useMemo, useReducer, useState } from 'react';
import reducer, { BookingItem, TForm } from './reducer';
import { actionSpreader } from 'utils/AddBooking';
import { Actions, INITIAL_STATE, OTHER_DAY_TYPES, steps } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';
import GapSuggestionView from './views/GapSuggestionView';
import NewBookingDetailsView from './views/NewBookingDetailsView';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import PreviewNewBooking from './views/PreviewNewBooking';
import { dateTypeState } from 'state/booking/dateTypeState';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import MileageBooking from './views/MileageBooking';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';
import { bookingState } from 'state/booking/bookingState';
import useAxios from 'hooks/useAxios';
import { BarredVenue } from 'pages/api/productions/venue/barred';
import { venueOptionsSelector } from 'state/booking/selectors/venueOptionsSelector';

type AddBookingProps = {
  visible: boolean;
  onClose: (bookings?: any) => void;
  startDate?: string;
  endDate?: string;
};

const AddBooking = ({ visible, onClose, startDate, endDate }: AddBookingProps) => {
  const { fetchData, data } = useAxios();

  const { stepIndex } = useRecoilValue(newBookingState);
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

  useEffect(() => {
    if (data) {
      onClose(data);
    }
  }, [data]);

  const currentProduction = useRecoilValue(currentProductionSelector);
  const { scheduleDateBlocks } = useRecoilValue(dateBlockSelector);
  const primaryBlock = scheduleDateBlocks?.find(({ IsPrimary }) => !!IsPrimary);

  const dayTypes = useRecoilValue(dateTypeState);
  const dayTypeOptions = useMemo(
    () => [...OTHER_DAY_TYPES, ...dayTypes.map(({ Id: value, Name: text }) => ({ text, value }))],
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
  };
  const updateBookingConflicts = (bookingConflicts: BookingWithVenueDTO[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BOOKING_CONFLICTS, bookingConflicts));
  };
  const updateBarringConflicts = (barringConflicts: BarredVenue[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BARRED_VENUES, barringConflicts));
  };

  const setNewBookingOnStore = (booking: BookingItem[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BOOKING, booking));
  };

  const handleSaveNewBooking = () => {
    fetchData({
      url: '/api/bookings/add',
      method: 'POST',
      data: state.booking,
    });
  };

  return (
    <PopupModal
      show={visible}
      onClose={() => onClose()}
      titleClass="text-xl text-primary-navy text-bold"
      title={steps[stepIndex]}
      panelClass="relative"
      hasOverlay={hasOverlay}
    >
      <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
        <NewBookingView
          updateBookingConflicts={updateBookingConflicts}
          updateBarringConflicts={updateBarringConflicts}
          dayTypeOptions={dayTypeOptions}
          onChange={onFormDataChange}
          formData={state.form}
          onClose={onClose}
          productionCode={productionCode}
          venueOptions={venueOptions}
        />
        <BookingConflictsView hasBarringIssues={state?.barringConflicts?.length > 0} data={state.bookingConflicts} />
        <BarringIssueView barringConflicts={state.barringConflicts} />
        <NewBookingDetailsView
          formData={state.form}
          data={state.booking}
          productionCode={productionCode}
          dateBlockId={primaryBlock?.Id}
          dayTypeOptions={dayTypeOptions}
          venueOptions={venueOptions}
          onSubmit={setNewBookingOnStore}
          toggleModalOverlay={(overlay) => setHasOverlay(overlay)}
          onClose={onClose}
        />
        <PreviewNewBooking
          formData={state.form}
          productionCode={productionCode}
          data={state.booking}
          dayTypeOptions={dayTypeOptions}
          onSaveBooking={handleSaveNewBooking}
        />
        <MileageBooking
          formData={state.form}
          productionCode={productionCode}
          data={state.booking}
          dayTypeOptions={dayTypeOptions}
        />
        <GapSuggestionView
          productionId={currentProduction?.Id}
          startDate={state.form.fromDate}
          endDate={state.form.toDate}
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
