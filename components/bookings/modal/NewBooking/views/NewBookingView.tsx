import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { venueState } from 'state/booking/venueState';
import { bookingState } from 'state/booking/bookingState';
import Typeahead from 'components/core-ui-lib/Typeahead';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { dateTypeState } from 'state/booking/dateTypeState';
import DateInput from 'components/core-ui-lib/DateInput';
import { useWizard } from 'react-use-wizard';
import { newBookingState } from 'state/booking/newBookingState';
import { TForm } from '../reducer';
import useAxios from 'hooks/useAxios';
import { BookingTypeMap, BookingTypes, steps } from 'config/AddBooking';
import Loader from 'components/core-ui-lib/Loader';
import { BookingWithVenueDTO } from 'interfaces';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';
import Select from 'components/core-ui-lib/Select';

type AddBookingProps = {
  formData: TForm;
  updateBookingConflicts: (bookingConflicts: BookingWithVenueDTO[]) => void;
  onChange: (change: Partial<TForm>) => void;
  onClose: () => void;
};

const NewBookingView = ({ onClose, onChange, formData, updateBookingConflicts }: AddBookingProps) => {
  const { nextStep, activeStep, goToStep } = useWizard();
  const setViewHeader = useSetRecoilState(newBookingState);
  const venueDict = useRecoilValue(venueState);
  const currentProduction = useRecoilValue(currentProductionSelector);
  const dayTypes = useRecoilValue(dateTypeState);
  const DayTypeOptions = useMemo(() => dayTypes.map(({ Id: value, Name: text }) => ({ text, value })), [dayTypes]);
  const bookingDict = useRecoilValue(bookingState);
  const scheduleRange = useRecoilValue(dateBlockSelector);
  const [stage, setStage] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const { loading: fetchingBookingConflicts, fetchData } = useAxios();
  const { fromDate, toDate, dateType, isDateTypeOnly, venueId, shouldFilterVenues } = formData;
  const productionCode = useMemo(
    () =>
      currentProduction
        ? `${currentProduction?.ShowCode}${currentProduction?.Code} ${currentProduction?.ShowName}`
        : 'All',
    [currentProduction],
  );
  const bookingTypeValue = useMemo(
    () => (isDateTypeOnly ? BookingTypeMap.DATE_TYPE : BookingTypeMap.VENUE),
    [isDateTypeOnly],
  );

  useEffect(() => {
    setViewHeader({ stepIndex: activeStep });
  }, [activeStep]);

  const [minDate, maxDate] = useMemo(() => [scheduleRange?.scheduleStart, scheduleRange?.scheduleEnd], [scheduleRange]);

  const VenueOptions = useMemo(() => {
    const options = [];
    const currentProductionVenues = Object.values(bookingDict).map((booking) => booking.VenueId);
    for (const venueId in venueDict) {
      const venue = venueDict[venueId];
      const option = {
        text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
        value: venue?.Id,
      };
      if (shouldFilterVenues && currentProductionVenues.includes(parseInt(venueId, 10))) {
        continue;
      }
      options.push(option);
    }
    return options;
  }, [venueDict, shouldFilterVenues, bookingDict]);
  const goToNext = () => {
    fetchData({
      url: '/api/bookings/conflict',
      method: 'POST',
      data: { ...formData, ProductionId: currentProduction?.Id },
    }).then((data: any) => {
      updateBookingConflicts(data);
      if (data.error) {
        console.log(data.error);
        return;
      }
      if (!data?.length) {
        goToStep(steps.indexOf('Barring Issue'));
      } else {
        nextStep();
      }
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
  };
  const onModalClose = () => {
    setError('');
    setStage(0);
    onClose();
  };
  const goToGapSuggestion = () => {
    goToStep(steps.indexOf('Venue Gap Suggestions'));
  };
  return (
    <div>
      <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      <form className="flex flex-col bg-primary-navy py-2 px-4 rounded-lg" onSubmit={handleOnSubmit}>
        {stage === 0 && (
          <div className="flex flex-col my-2">
            <div className="text-white text-sm font-bold pl-2">Date</div>
            <DateInput
              placeholder="DD/MM/YY"
              popperClassName="!z-[51]"
              inputClass="w-full"
              className="rounded border-gray-300 px-3 z-90 w-full my-1 h-9"
              minDate={minDate ? new Date(minDate) : null}
              maxDate={maxDate ? new Date(maxDate) : null}
              value={fromDate ? new Date(fromDate) : null}
              onChange={(date) =>
                onChange({
                  fromDate: date?.toLocaleDateString(),
                  ...(!toDate && { toDate: date?.toLocaleDateString() }),
                })
              }
            />
          </div>
        )}
        {stage === 0 && (
          <div className="flex flex-col my-2">
            <div className="text-white text-sm font-bold pl-2">Last Date</div>
            <DateInput
              placeholder="DD/MM/YY"
              popperClassName="!z-[51]"
              inputClass="w-full"
              className="rounded border-gray-300 px-3 z-90 w-full my-1 h-9"
              value={toDate ? new Date(toDate) : null}
              minDate={fromDate ? new Date(fromDate) : new Date()}
              maxDate={maxDate ? new Date(maxDate) : null}
              onChange={(date) => onChange({ toDate: date?.toLocaleDateString() })}
            />
          </div>
        )}
        <Select
          className="w-[160px] my-2"
          value={bookingTypeValue}
          options={BookingTypes}
          onChange={(v) => onChange({ isDateTypeOnly: v === BookingTypeMap.DATE_TYPE })}
        />
        {isDateTypeOnly && (
          <>
            <Typeahead
              className={classNames('my-2', { 'max-w-full': stage === 1, 'w-full': stage === 0 })}
              options={DayTypeOptions}
              disabled={stage !== 0}
              onChange={(value) => onChange({ dateType: parseInt(value as string, 10) })}
              value={dateType}
              placeholder={'Please select a Day Type'}
            />
          </>
        )}
        {!isDateTypeOnly && (
          <>
            <Typeahead
              className={classNames('my-2', { 'max-w-full': stage === 1, 'w-full': stage === 0 })}
              options={VenueOptions}
              disabled={stage !== 0}
              onChange={(value) => onChange({ venueId: parseInt(value as string, 10) })}
              value={venueId}
              placeholder={'Please select a venue'}
            />
            <Checkbox
              id="shouldFilterVenues"
              labelClassName="text-white"
              onChange={(e: any) => onChange({ shouldFilterVenues: e.target.checked })}
              checked={shouldFilterVenues}
              label="Hide venues with existing bookings for this production?"
            />
            <Button
              className="px-4"
              disabled={!(fromDate && toDate)}
              variant="secondary"
              text="Gap Suggest"
              onClick={goToGapSuggestion}
            />
          </>
        )}
      </form>
      {error && <div className="text-red-500 font-medium my-1">{error}</div>}
      <div className="grid grid-cols-3 my-4 gap-2">
        <Button
          onClick={() => null}
          disabled={!(venueId || dateType) || !fromDate || !toDate}
          className="px-6"
          text={'Check Mileage'}
        ></Button>
        <Button
          onClick={onModalClose}
          disabled={!(venueId || dateType) || !fromDate || !toDate}
          variant="secondary"
          text={'Cancel'}
        ></Button>
        {!fetchingBookingConflicts && (
          <Button
            onClick={goToNext}
            disabled={(isDateTypeOnly && !dateType) || (!isDateTypeOnly && !venueId) || !fromDate || !toDate}
            text={'Next'}
          ></Button>
        )}
        {fetchingBookingConflicts && <Loader variant={'sm'} />}
      </div>
    </div>
  );
};

export default NewBookingView;
