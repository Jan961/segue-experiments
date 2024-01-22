import React, { useMemo, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Spinner } from 'components/global/Spinner';
import { StyledDialog } from 'components/global/StyledDialog';
import FormTypeahead from 'components/global/forms/FormTypeahead';
import { venueState } from 'state/booking/venueState';
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector';
import { performanceState } from 'state/booking/performanceState';
import { bookingState } from 'state/booking/bookingState';
import { ToolbarButton } from '../../ToolbarButton';
import { getDateBlockId } from '../../panel/utils/getDateBlockId';
import PerformanceRowEditor from './PerformanceRowEditor';

const initialState = {
  fromDate: null,
  toDate: null,
  venue: null,
};

type PerformanceItem = {
  hasPerformance?: boolean;
  performanceTimes?: string[];
  date?: string;
};

type PerformanceData = {
  [key: string]: PerformanceItem;
};
const AddBooking = () => {
  const venueDict = useRecoilValue(venueState);
  const schedule = useRecoilValue(scheduleSelector);
  const [perfDict, setPerfDict] = useRecoilState(performanceState);
  const [bookingDict, setBookingDict] = useRecoilState(bookingState);
  const [stage, setStage] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState<string>('');
  const [performancesData, setPerformancesData] = useState<PerformanceData>({});
  const availableDates = useMemo(() => {
    const dates = [];
    const tourSchedule = schedule.Sections?.find?.((schedule) => schedule.Name === 'Tour');
    for (const Date of tourSchedule?.Dates || []) {
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

  const VenueOptions = useMemo(
    () => Object.values(venueDict).map((venue) => ({ name: `${venue?.Name} ${venue?.Town}`, value: venue?.Id })),
    [venueDict],
  );
  const handleOnChange = (e) => {
    let { name, value }: { name: string; value: any } = e.target;
    if (name === 'fromDate' || name === 'toDate') value = value || '';
    if (name === 'venue') value = parseInt(value, 10);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const goToNext = () => {
    setStage((prev) => prev + 1);
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
  };
  const onModalClose = () => {
    setError('');
    setStage(0);
    setFormData(initialState);
    setShowModal(false);
  };
  const addBookings = async () => {
    setError('');
    const payload = [];
    for (const booking of Object.values(performancesData)) {
      const { hasPerformance, performanceTimes, date } = booking;
      if (hasPerformance) {
        const DateBlockId = getDateBlockId(schedule, date);
        payload.push({ DateBlockId, performanceTimes, VenueId: formData.venue, Date: date });
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
  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Add Booking</ToolbarButton>
      <StyledDialog
        className="relative overflow-visible"
        open={showModal}
        onClose={onModalClose}
        title="Add Booking"
        width="xl"
      >
        {loading && (
          <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
            <Spinner className="w-full" size="lg" />
          </div>
        )}
        <form className="flex flex-col bg-primary-navy py-2 px-4 rounded-lg" onSubmit={handleOnSubmit}>
          <FormTypeahead
            className={classNames('my-2', { 'max-w-full': stage === 1, 'w-80': stage === 0 })}
            options={VenueOptions}
            disabled={stage !== 0}
            onChange={(value) =>
              handleOnChange({ target: { name: 'venue', value } } as React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement
              >)
            }
            value={formData.venue}
            placeholder={'Please select a venue'}
          />
          {stage === 0 && (
            <div className="flex flex-col my-2">
              <div className="text-white text-sm font-bold pl-2">Start Date</div>
              <DatePicker
                placeholderText="DD/MM/YY"
                dateFormat="dd/MM/yy"
                popperClassName="!z-[51] w-80"
                className="rounded border-gray-300 px-3 z-90 w-full my-1"
                minDate={minDate ? new Date(minDate) : null}
                maxDate={maxDate ? new Date(maxDate) : null}
                selected={formData.fromDate ? new Date(formData.fromDate) : null}
                onChange={(date) => handleOnChange({ target: { name: 'fromDate', value: date.toLocaleDateString() } })}
              />
            </div>
          )}
          {stage === 0 && (
            <div className="flex flex-col my-2">
              <div className="text-white text-sm font-bold pl-2">End Date</div>
              <DatePicker
                placeholderText="DD/MM/YY"
                dateFormat="dd/MM/yy"
                popperClassName="!z-[51]"
                className="rounded border-gray-300 px-3 z-90 w-full my-1"
                selected={formData?.toDate ? new Date(formData?.toDate) : null}
                minDate={formData?.fromDate ? new Date(formData?.fromDate) : new Date()}
                maxDate={maxDate ? new Date(maxDate) : null}
                onChange={(date) => handleOnChange({ target: { name: 'toDate', value: date.toLocaleDateString() } })}
              />
            </div>
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
        <div className="flex justify-end my-4 gap-2">
          {stage === 1 && (
            <ToolbarButton
              onClick={() => {
                setStage((stage) => stage - 1);
                setError('');
              }}
              disabled={!formData.venue || !formData.fromDate || !formData.toDate}
              className=""
            >
              Reject
            </ToolbarButton>
          )}
          <ToolbarButton
            onClick={stage === 0 ? goToNext : addBookings}
            disabled={!formData.venue || !formData.fromDate || !formData.toDate}
            className=""
          >
            {stage === 0 ? 'Next' : 'Accept'}
          </ToolbarButton>
        </div>
      </StyledDialog>
    </>
  );
};

export default AddBooking;
