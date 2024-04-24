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
import format from 'date-fns/format';
import { parseISO } from 'date-fns';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';
import Button from 'components/core-ui-lib/Button';
import axios from 'axios';

interface MoveBookingViewProps {
  bookings: BookingItem[];
  venueOptions: SelectOption[];
  onClose: () => void;
}

type BookingDetails = {
  count: string;
  venue: string;
  startDate: string;
  endDate:string
  moveDate:string
};

const MoveBookingView = ({ venueOptions, bookings = [], onClose }: MoveBookingViewProps) => {
  const { scheduleStart, scheduleEnd } = useRecoilValue(dateBlockSelector);
  const currentProduction = useRecoilValue(currentProductionSelector);
  const productionId = currentProduction?.Id;
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({ count: '', venue: '', startDate: '', endDate : '', moveDate : '' });

  const [selectedProduction, setSelectedProduction] = useState<SelectOption>(undefined);
  const productionOptions = useRecoilValue(productionOptionsSelector(true));

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
      const endDate = bookings[bookings.length -1].dateAsISOString;
      const count = bookings.length <= 10 ? toWords(bookings.length) : bookings.length;
      const venue = venueOptions.find(({ value }) => value === bookings[0].venue);
      setBookingDetails({ startDate, endDate, count, venue: venue?.text || '', moveDate:startDate });
    }
  }, [bookings, venueOptions]);

  const handleProductionChange = (value) => {};

  const handleDateChange = (value: Date) => {
    setBookingDetails(prev => ({...prev, moveDate: value.toISOString()}));
  };

  const checkForBookingConflicts = async () => {

    if (bookingDetails.venue) {
      const lastRow = tableRef.current
        .getApi()
        .getDisplayedRowAtIndex(tableRef.current.getApi().getDisplayedRowCount() - 1);
      try {
        const response = await axios.post('/api/bookings/conflict', {
          fromDate: bookingDetails.,
          toDate: lastRow.data.dateAsISOString,
          productionId: production.Id,
        });
        if (!isNullOrEmpty(response.data)) {
          updateBookingConflicts(response.data);
          goToStep(getStepIndex(isNewBooking, 'Booking Conflict'));
        } else {
          setchangeBookingLengthConfirmed(true);
          storeBookingDetails();
          setchangeBookingLength((prev) => !prev);
        }
      } catch (e) {
        console.log('Error getting barred venues');
      }
    } 
  };

  const handleMoveBooking = () => {};

  return (
    <>
      <div className="w-[485px]">
        <div className="text-primary-navy text-xl my-2 font-bold">{`${currentProduction?.ShowCode}${currentProduction?.Code}  ${currentProduction?.ShowName}`}</div>
        <Label className="text-md my-2" text={`Move ${bookingDetails.count} date booking at ${bookingDetails.venue}`} />
        <div className="w-[400px] flex flex-col items-end">
          <Select
            className="w-full"
            label="Production"
            name="production"
            placeholder="Please select a Production"
            value={selectedProduction?.value}
            options={fomrattedProductions}
            isClearable={false}
            onChange={(production) => handleProductionChange({ productionId: production })}
          />
          <Label className="text-md" text="*Current Production" />
        </div>
        <Label text={`Currently scheduled to start on ${bookingDetails.startDate}`} />
        <div className="flex item-center gap-2">
          <Label text="New start date" />
          <DateInput
            label="Date"
            onChange={handleDateChange}
            value={bookingDetails.moveDate}
            minDate={parseISO(scheduleStart)}
            maxDate={parseISO(scheduleEnd)}
          />
        </div>
      </div>
      <div className="pt-8 w-full flex justify-end  items-center gap-3">
        <Button className="w-33 " variant="secondary" text="Cancel" onClick={onClose} />
        <Button className="w-33 " variant="primary" text="Move Booking" onClick={handleMoveBooking} />
      </div>
    </>
  );
};

export default MoveBookingView;
