import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import Select from 'components/core-ui-lib/Select';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { useWizard } from 'react-use-wizard';
import { BookingItem, TForm } from '../reducer';
import useAxios from 'hooks/useAxios';
import { getStepIndex } from 'config/AddBooking';
import Loader from 'components/core-ui-lib/Loader';
import { BookingWithVenueDTO } from 'interfaces';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';
import DateRange from 'components/core-ui-lib/DateRange';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';
import Toggle from 'components/core-ui-lib/Toggle/Toggle';
import Label from 'components/core-ui-lib/Label';
import {
  areDatesSame,
  dateToSimple,
  formattedDateWithWeekDay,
  getArrayOfDatesBetween,
  newDate,
} from 'services/dateService';
import { debug } from 'utils/logging';
import { isNullOrEmpty } from 'utils';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';

type AddBookingProps = {
  formData: TForm;
  dayTypeOptions: SelectOption[];
  venueOptions: SelectOption[];
  productionCode: string;
  updateBookingConflicts: (bookingConflicts: BookingWithVenueDTO[]) => void;
  updateBarringConflicts: (barringConflicts: BarredVenue[]) => void;
  onBarringCheckComplete: (nextStep: string) => void;
  updateModalTitle: (title: string) => void;
  onChange: (change: Partial<TForm>) => void;
  onSubmit: (booking: Partial<BookingItem>[]) => void;
  onClose: () => void;
};

const NewBookingView = ({
  onClose,
  onChange,
  onSubmit,
  formData,
  productionCode,
  dayTypeOptions,
  venueOptions,
  updateBookingConflicts,
  updateBarringConflicts,
  onBarringCheckComplete,
  updateModalTitle,
}: AddBookingProps) => {
  const { goToStep } = useWizard();
  const permissions = useRecoilValue(accessBookingsHome);
  const currentProduction = useRecoilValue(currentProductionSelector);
  const scheduleRange = useRecoilValue(dateBlockSelector);
  const [stage, setStage] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const { loading: fetchingBookingConflicts, fetchData } = useAxios();
  const { loading, fetchData: api } = useAxios();
  const { fromDate, toDate, dateType, isDateTypeOnly, venueId, shouldFilterVenues, isRunOfDates } = formData;

  useEffect(() => {
    updateModalTitle('Create New Booking');
    onBarringCheckComplete('New Booking Details');
  }, []);

  const [minDate, maxDate] = useMemo(() => [scheduleRange?.scheduleStart, scheduleRange?.scheduleEnd], [scheduleRange]);

  const fetchBarredVenues = (skipRedirect = false): Promise<any> => {
    const { venueId, fromDate: startDate, toDate: endDate } = formData;
    return api({
      url: '/api/productions/venue/barringCheck',
      method: 'POST',
      data: {
        productionId: currentProduction?.Id,
        venueId,
        seats: 400,
        barDistance: 25,
        includeExcluded: false,
        startDate,
        endDate,
        filterBarredVenues: true,
      },
    })
      .then((data: any) => {
        updateBarringConflicts(
          data
            .map((barredVenue: BarredVenue) => ({ ...barredVenue, date: dateToSimple(barredVenue.date) }))
            .filter((venue: BarredVenue) => venue.hasBarringConflict),
        );
        if (skipRedirect) return;
        if (data?.length > 0) {
          goToStep(getStepIndex(true, 'Barring Issue'));
        } else {
          goToStep(getStepIndex(true, 'New Booking Details'));
        }
      })
      .catch((error) => {
        debug(error);
      });
  };

  const goToNext = () => {
    if (formData.isDateTypeOnly && formData.isRunOfDates) {
      onChange({ isRunOfDates: false });
    }
    fetchData({
      url: '/api/bookings/conflict',
      method: 'POST',
      data: { ...formData, productionId: currentProduction?.Id },
    })
      .then(async (data: any) => {
        updateBookingConflicts(data);
        if (data.error) {
          console.log(data.error);
          return;
        }
        if (isNullOrEmpty(data)) {
          if (isDateTypeOnly) {
            goToStep(getStepIndex(true, 'New Booking Details'));
          } else {
            fetchBarredVenues(false);
          }
        } else if (!isDateTypeOnly) {
          await fetchBarredVenues(true);
          goToStep(getStepIndex(true, 'Booking Conflict'));
        }
      })
      .catch((error) => {
        debug(error);
      });
  };

  const handleChange = ({ from, to }) => {
    const fromDate = from?.toISOString() || null;
    const toDate = to?.toISOString() || null;

    const change = {
      fromDate,
      toDate,
      isRunOfDates: !areDatesSame(fromDate, toDate),
    };

    onChange(change);
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
    goToStep(getStepIndex(true, 'Venue Gap Suggestions'));
  };

  const createBookingsForDateRange = () => {
    const dates = getArrayOfDatesBetween(fromDate, toDate);

    const bookings = dates.map((d) => ({
      date: formattedDateWithWeekDay(d, 'Short'),
      dateAsISOString: d,
      venue: venueId,
    }));
    onSubmit(bookings);
  };

  const handleCheckMileageClick = () => {
    createBookingsForDateRange();
    goToStep(getStepIndex(true, 'Check Mileage'));
  };
  return (
    <div className="w-[385px]">
      <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      <form className="flex flex-col bg-primary-navy py-3 pl-4 pr-5 rounded-lg" onSubmit={handleOnSubmit}>
        <DateRange
          testId="cnb-date-range"
          label="Date"
          className=" bg-white my-2 w-fit"
          onChange={handleChange}
          value={{ from: fromDate ? newDate(fromDate) : null, to: toDate ? newDate(toDate) : null }}
          minDate={minDate ? newDate(minDate) : null}
          maxDate={maxDate ? newDate(maxDate) : null}
        />
        {!isDateTypeOnly && (
          <div className="flex items-center gap-2 my-1 justify-start">
            <Checkbox
              testId="cnb-runofdates-checkbox"
              className="!w-fit"
              id="shouldFilterVenues"
              labelClassName="text-white w-fit"
              onChange={(e: any) => {
                onChange({ isRunOfDates: e.target.checked });
              }}
              checked={isRunOfDates}
              label="This is a run of dates. Y/N"
            />
            <div data-testid="cnb-runofdates-info-icon">
              <Tooltip
                testId="cnb-runofdates-info-tooltip"
                body="A run of dates is a single booking over multiple days. Ie a week of performances at one venue. If this is not selected, each date will be considered a separate booking."
                position="right"
                width="w-[140px]"
                bgColorClass="primary-input-text"
              >
                <Icon iconName="info-circle-solid" />
              </Tooltip>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Label className="text-white font-bold" text="Set Venue" />
          <Toggle
            testId="new-booking-set-venue"
            label="SetVenue"
            checked={isDateTypeOnly}
            onChange={(value) =>
              onChange({
                isDateTypeOnly: value,
                dateType: value ? dateType : null,
                venueId: null,
              })
            }
          />
          <Label className="text-white font-bold" text="Set Day Type" />
        </div>
        {isDateTypeOnly && (
          <>
            <Select
              testId="cnb-datetype-selector"
              className="my-2 w-full !border-0"
              options={dayTypeOptions}
              disabled={stage !== 0}
              onChange={(value) => onChange({ dateType: parseInt(value as string, 10) })}
              value={dateType}
              isSearchable
              placeholder="Please select a Day Type"
            />
          </>
        )}
        {!isDateTypeOnly && (
          <>
            <Select
              testId="cnb-venue-selector"
              className={classNames('my-2 w-full !border-0')}
              options={venueOptions}
              disabled={stage !== 0}
              onChange={(value) => onChange({ venueId: parseInt(value as string, 10) })}
              value={venueId}
              isSearchable
              placeholder="Please select a venue"
            />
            <Checkbox
              testId="cnb-filter-existing-booking-venues"
              id="shouldFilterVenues"
              labelClassName="text-white"
              onChange={(e: any) => onChange({ shouldFilterVenues: e.target.checked })}
              checked={shouldFilterVenues}
              label="Hide venues with existing bookings for this production?"
            />
            <div
              className={classNames('w-full', { 'cursor-not-allowed caret-primary-input-text': !(fromDate && toDate) })}
            >
              <Button
                testId="new-booking-gap-suggest"
                className="px-4 my-2 !w-full"
                disabled={!(fromDate && toDate)}
                variant="secondary"
                text="Gap Suggest"
                onClick={goToGapSuggestion}
              />
            </div>
          </>
        )}
      </form>
      {error && <div className="text-red-500 font-medium my-1">{error}</div>}
      <div className="flex mt-4 justify-between">
        <div
          className={classNames({
            'cursor-not-allowed caret-primary-input-text': !venueId || !fromDate || !toDate,
          })}
        >
          <Button
            onClick={handleCheckMileageClick}
            disabled={
              !permissions.includes('ACCESS_MILEAGE_CHECK') || !venueId || !fromDate || !toDate || isDateTypeOnly
            }
            className="px-6"
            text="Check Mileage"
          />
        </div>
        <Button className="px-8" onClick={onModalClose} variant="secondary" text="Cancel" />
        {!fetchingBookingConflicts && (
          <div
            className={classNames({
              'cursor-not-allowed caret-primary-input-text':
                (isDateTypeOnly && !dateType) || (!isDateTypeOnly && !venueId) || !fromDate || !toDate,
            })}
          >
            <Button
              className="px-9"
              onClick={goToNext}
              disabled={(isDateTypeOnly && !dateType) || (!isDateTypeOnly && !venueId) || !fromDate || !toDate}
              text="Next"
            />
          </div>
        )}
        {(fetchingBookingConflicts || loading) && <Loader variant="sm" />}
      </div>
    </div>
  );
};

export default NewBookingView;
