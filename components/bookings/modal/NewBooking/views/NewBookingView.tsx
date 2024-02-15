import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Spinner } from 'components/global/Spinner';
import { venueState } from 'state/booking/venueState';
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector';
import { performanceState } from 'state/booking/performanceState';
import { bookingState } from 'state/booking/bookingState';
import { getDateBlockId } from '../../../panel/utils/getDateBlockId';
import PerformanceRowEditor from '../PerformanceRowEditor';
import Typeahead from 'components/core-ui-lib/Typeahead';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { dateTypeState } from 'state/booking/dateTypeState';
import DateInput from 'components/core-ui-lib/DateInput';
import { useWizard } from 'react-use-wizard';
import { newBookingState } from 'state/booking/newBookingState';
import { TForm } from '../reducer';
import useAxios from 'hooks/useAxios';
import { steps } from 'config/AddBooking';
import Loader from 'components/core-ui-lib/Loader';
import { BookingWithVenueDTO } from 'interfaces';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';

type PerformanceItem = {
  hasPerformance?: boolean;
  performanceTimes?: string[];
  date?: string;
};

type PerformanceData = {
  [key: string]: PerformanceItem;
};

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
  const schedule = useRecoilValue(scheduleSelector);
  const currentProduction = useRecoilValue(currentProductionSelector);
  const dayTypes = useRecoilValue(dateTypeState);
  const DayTypeOptions = useMemo(() => dayTypes.map(({ Id: value, Name: text }) => ({ text, value })), [dayTypes]);
  const [perfDict, setPerfDict] = useRecoilState(performanceState);
  const [bookingDict, setBookingDict] = useRecoilState(bookingState);
  const [stage, setStage] = useState<number>(0);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [performancesData, setPerformancesData] = useState<PerformanceData>({});
  const { loading: fetchingBookingConflicts, fetchData } = useAxios();
  const { fromDate, toDate, dateType, isDateTypeOnly, venueId, shouldFilterVenues } = formData;
  const productionCode = useMemo(
    () => (currentProduction ? `${currentProduction?.ShowCode}${currentProduction?.Code}` : 'All'),
    [currentProduction],
  );
  const availableDates = useMemo(() => {
    const dates = [];
    const productionSchedule = schedule.Sections?.find?.((schedule) => schedule.Name === 'Production');
    for (const Date of productionSchedule?.Dates || []) {
      const { GetInFitUpIds = [], OtherIds = [], PerformanceIds = [], RehearsalIds = [], BookingIds = [] } = Date || {};
      if ([...GetInFitUpIds, ...OtherIds, ...PerformanceIds, ...RehearsalIds, ...BookingIds].length === 0) {
        dates.push(Date.Date);
      } else if (BookingIds.length) {
        const hasUnConfirmedBookings = BookingIds.some((id) => bookingDict?.[id]?.StatusCode === 'U');
        if (hasUnConfirmedBookings) {
          dates.push(Date.Date);
        }
      }
    }
    return dates;
  }, [schedule]);

  useEffect(() => {
    setViewHeader({ stepIndex: activeStep });
  }, [activeStep]);

  const [minDate, maxDate] = useMemo(
    () => [availableDates?.[0], availableDates?.[availableDates.length - 1]],
    [availableDates],
  );
  const dateRange = useMemo(() => {
    const { fromDate, toDate } = formData || {};
    if (!fromDate || !toDate) return [];
    const start = new Date(fromDate);
    const end = new Date(toDate);
    return availableDates.filter(
      (date) => new Date(date).valueOf() > start.valueOf() && new Date(date).valueOf() < end.valueOf(),
    );
  }, [formData.fromDate, formData.toDate, availableDates]);

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
      data: formData,
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
    // setStage((prev) => prev + 1);
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
  };
  const onModalClose = () => {
    setError('');
    setStage(0);
    onClose();
  };
  const addBookings = async () => {
    setError('');
    const payload = [];
    for (const booking of Object.values(performancesData)) {
      const { hasPerformance, performanceTimes, date } = booking;
      if (hasPerformance) {
        const DateBlockId = getDateBlockId(schedule, date);
        payload.push({ DateBlockId, performanceTimes, VenueId: formData.venueId, Date: date });
      }
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/bookings/add', payload);
      const newBookingsDict = data.bookings.reduce((dict, curr) => {
        dict[curr.Id] = curr;
        return dict;
      }, {});
      const newPerformanceDict = data.performances.reduce((dict, curr) => {
        dict[curr.Id] = curr;
        return dict;
      }, {});
      setBookingDict({ ...bookingDict, ...newBookingsDict });
      setPerfDict({ ...perfDict, ...newPerformanceDict });
      setIsLoading(false);
      onModalClose();
    } catch (e) {
      setIsLoading(false);
      setError('Something went wrong. Please try again later.');
    }
  };
  const onPerformanceDataChange = (date: string, key: string, value: any) => {
    setError('');
    setPerformancesData((prev) => ({ ...prev, [date]: { ...(prev?.[date] || {}), [key]: value, date } }));
  };
  const goToGapSuggestion = () => {
    goToStep(steps.indexOf('Venue Gap Suggestions'));
  };
  return (
    <div>
      {loading && (
        <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
          <Spinner className="w-full" size="lg" />
        </div>
      )}
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
              onChange={(date) => onChange({ fromDate: date?.toLocaleDateString() })}
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
        {isDateTypeOnly && (
          <Typeahead
            className={classNames('my-2', { 'max-w-full': stage === 1, 'w-full': stage === 0 })}
            options={DayTypeOptions}
            disabled={stage !== 0}
            onChange={(value) => onChange({ dateType: parseInt(value as string, 10) })}
            value={dateType}
            placeholder={'Please select a DayType'}
          />
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
            <div className="flex flex-wrap item-center w-full gap-2">
              <Button className="px-4" variant="secondary" text="Gap Suggest" onClick={goToGapSuggestion} />
              <Button
                className="px-4 flex-grow"
                variant="secondary"
                text="Continue with DayType only"
                onClick={() => onChange({ isDateTypeOnly: true })}
              />
            </div>
          </>
        )}
        {stage === 1 && (
          <div className="flex flex-col">
            <div className="grid grid-cols-12 text-white p-2 text-sm font-bold">
              <div className="col-span-6 text-white px-2 ">Date</div>
              <div className="col-span-2 text-white px-2">Perf Y/N</div>
              <div className="col-span-2 text-white px-2">No: Perf</div>
              <div className="col-span-2 text-white px-2">Time</div>
            </div>
            <div className="p-2 bg-white rounded-lg max-h-[400px] overflow-y-scroll">
              {dateRange.length === 0 && <div className="text-red-500">All dates booked!!</div>}
              {dateRange.map((date, i) => (
                <PerformanceRowEditor onPerformanceDataChange={onPerformanceDataChange} key={i} date={date} />
              ))}
            </div>
          </div>
        )}
      </form>
      {error && <div className="text-red-500 font-medium my-1">{error}</div>}
      <div className="grid grid-cols-3 my-4 gap-2">
        <Button
          onClick={stage === 0 ? goToNext : addBookings}
          disabled={!(venueId || dateType) || !fromDate || !toDate}
          className="px-6"
          text={'Check Mileage'}
        ></Button>
        <Button
          onClick={stage === 0 ? goToNext : addBookings}
          disabled={!(venueId || dateType) || !fromDate || !toDate}
          variant="secondary"
          text={'Cancel'}
        ></Button>
        {stage === 1 && (
          <Button
            onClick={() => {
              setStage((stage) => stage - 1);
              setError('');
            }}
            disabled={!(venueId || dateType) || !fromDate || !toDate}
            text="Reject"
          ></Button>
        )}
        {!fetchingBookingConflicts && (
          <Button
            onClick={stage === 0 ? goToNext : addBookings}
            disabled={!(venueId || dateType) || !fromDate || !toDate}
            text={stage === 0 ? 'Next' : 'Accept'}
          ></Button>
        )}
        {fetchingBookingConflicts && <Loader variant={'sm'} />}
      </div>
    </div>
  );
};

export default NewBookingView;
