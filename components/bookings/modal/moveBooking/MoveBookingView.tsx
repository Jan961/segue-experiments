import Label from 'components/core-ui-lib/Label';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionOptionsSelector } from 'state/booking/selectors/productionOptionsSelector';
import { BookingItem } from '../NewBooking/reducer';
import DateInput from 'components/core-ui-lib/DateInput';
import { isNullOrEmpty } from 'utils';
import { toWords } from 'number-to-words';
import { addDays, parseISO } from 'date-fns';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import Button from 'components/core-ui-lib/Button';
import axios from 'axios';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';
import { BookingWithVenueDTO } from 'interfaces';
import { useWizard } from 'react-use-wizard';
import { dateToSimple, formatDate, newDate } from 'services/dateService';
import { MoveParams } from '.';
import { productionJumpState } from 'state/booking/productionJumpState';

interface MoveBookingViewProps {
  bookings: BookingItem[];
  venueOptions: SelectOption[];
  onClose: () => void;
  viewSteps: string[];
  updateBarringConflicts: (barringConflicts: BarredVenue[]) => void;
  updateBookingConflicts: (bookingConflicts: BookingWithVenueDTO[]) => void;
  updateMoveParams: (value: MoveParams) => void;
}

type BookingDetails = {
  count: string;
  venue: string;
  startDate: string;
  endDate: string;
  moveDate: string;
  moveEndDate: string;
  production: string;
};

type ScheduleDate = {
  startDate: string;
  endDate: string;
};

const MoveBookingView = ({
  venueOptions,
  bookings = [],
  onClose,
  updateBarringConflicts,
  updateBookingConflicts,
  viewSteps,
  updateMoveParams,
}: MoveBookingViewProps) => {
  const currentProduction = useRecoilValue(currentProductionSelector);
  const productionId = currentProduction?.Id;

  const { goToStep } = useWizard();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    count: '',
    venue: '',
    startDate: '',
    endDate: '',
    moveDate: '',
    moveEndDate: '',
    production: '',
  });

  const [selectedProduction, setSelectedProduction] = useState<SelectOption>(undefined);
  const productionOptions = useRecoilValue(productionOptionsSelector(true));
  const [scheduleDate, setScheduleDate] = useState<ScheduleDate>({ startDate: '', endDate: '' });
  const { productions } = useRecoilValue(productionJumpState);
  const fomrattedProductions = useMemo(() => {
    if (productionId && productionOptions) {
      return productionOptions.map((po) => (po.value === productionId ? { ...po, text: `${po.text} *` } : po));
    }
    return [];
  }, [productionId, productionOptions]);

  useEffect(() => {
    if (productionId && fomrattedProductions) {
      setSelectedProduction(fomrattedProductions.find(({ value }) => value === productionId));
    }
  }, [fomrattedProductions, productionId]);

  useEffect(() => {
    if (!isNullOrEmpty(bookings)) {
      const startDate = bookings[0].dateAsISOString;
      const endDate = bookings[bookings.length - 1].dateAsISOString;
      const count = bookings.length <= 10 ? toWords(bookings.length) : bookings.length;
      const venue = venueOptions.find(({ value }) => value === bookings[0].venue);
      const production = productions.find(({ Id }) => Id === productionId);
      setBookingDetails({
        startDate,
        endDate,
        count,
        venue: venue?.text || '',
        moveDate: startDate,
        moveEndDate: endDate,
        production: `${production?.ShowCode}${production?.Code}  ${production?.ShowName}`,
      });

      setScheduleDate({ startDate: production.StartDate, endDate: production.EndDate });
    }
  }, [bookings, venueOptions]);

  const handleProductionChange = (value: string | number) => {
    setSelectedProduction(fomrattedProductions.find(({ value: id }) => id === value));
    const production = productions.find(({ Id }) => Id === value);
    setBookingDetails((prev) => ({
      ...prev,
      production: `${production?.ShowCode}${production?.Code}  ${production?.ShowName}`,
    }));
    setScheduleDate({ startDate: production.StartDate, endDate: production.EndDate });
  };

  const handleDateChange = (value: Date) => {
    const endDate = addDays(value, bookings.length - 1);
    setBookingDetails((prev) => ({ ...prev, moveDate: value.toISOString(), moveEndDate: endDate.toISOString() }));
  };

  const checkForBarredVenues = async (skipRedirect = false) => {
    if (!bookingDetails.venue) {
      goToStep(viewSteps.indexOf('Preview New Booking'));
    } else {
      try {
        const response = await axios.post('/api/productions/venue/barringCheck', {
          startDate: bookingDetails.moveDate,
          endDate: bookingDetails.moveEndDate,
          productionId: selectedProduction.value,
          venueId: bookings[0].venue,
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
          if (skipRedirect) return;
          goToStep(viewSteps.indexOf('Barring Issue'));
        } else {
          updateBarringConflicts(null);
          goToStep(viewSteps.indexOf('MoveConfirm'));
        }
      } catch (e) {
        console.log('Error getting barred venues');
      }
    }
  };

  const checkForBookingConflicts = async () => {
    if (bookingDetails.venue) {
      try {
        const response = await axios.post('/api/bookings/conflict', {
          fromDate: bookingDetails.moveDate,
          toDate: bookingDetails.moveEndDate,
          productionId: selectedProduction.value,
        });
        if (!isNullOrEmpty(response.data)) {
          updateBookingConflicts(response.data);
          await checkForBarredVenues(true);
          goToStep(viewSteps.indexOf('Booking Conflict'));
        } else {
          checkForBarredVenues();
        }
      } catch (e) {
        console.log('Error getting barred venues');
      }
    } else {
      goToStep(viewSteps.indexOf('MoveConfirm'));
    }
  };

  const handleMoveBooking = async () => {
    const { data } = await axios.post('/api/dateBlock/read', {
      productionId: selectedProduction.value,
      primaryOnly: true,
    });
    const dateBlock = data[0];
    const updatedBookings = bookings.map((b, i) => {
      const date = addDays(parseISO(bookingDetails.moveDate), i);
      return {
        ...b,
        date: date.toISOString(),
        dateAsISOString: date.toISOString(),
        dateBlockId: dateBlock?.Id,
      };
    });

    updateMoveParams({
      count: bookingDetails.count,
      date: bookingDetails.moveDate,
      productionName: bookingDetails.production,
      venue: bookingDetails.venue,
      bookings: updatedBookings,
    });
    checkForBookingConflicts();
  };

  return (
    <div className="w-[485px]" data-testid="move-booking-model">
      <Label className="text-md my-2" text={`Move ${bookingDetails.count} date booking at ${bookingDetails.venue}`} />
      <div className="w-[400px] flex flex-col items-end">
        <Select
          testId="move-booking-production-selector"
          className="w-full"
          label="Production"
          name="production"
          placeholder="Please select a Production"
          value={selectedProduction?.value}
          options={fomrattedProductions}
          isClearable={false}
          onChange={handleProductionChange}
        />
        <Label className="text-md" text="*Current Production" />
      </div>
      <Label
        text={`Currently scheduled to start on ${
          bookingDetails.moveDate ? formatDate(bookingDetails.moveDate, 'dd/MM/yy') : ''
        }`}
      />
      <div className="flex item-center gap-2">
        <Label text="New start date" />
        <DateInput
          testId="new-start-date"
          label="Date"
          onChange={handleDateChange}
          value={bookingDetails.moveDate}
          minDate={newDate(scheduleDate?.startDate)}
          maxDate={newDate(scheduleDate?.endDate)}
        />
      </div>
      <div className="pt-8 w-full flex justify-end  items-center gap-3">
        <Button className="w-33 " variant="secondary" text="Cancel" onClick={onClose} />
        <Button className="w-33 " variant="primary" text="Move Booking" onClick={handleMoveBooking} />
      </div>
    </div>
  );
};

export default MoveBookingView;
