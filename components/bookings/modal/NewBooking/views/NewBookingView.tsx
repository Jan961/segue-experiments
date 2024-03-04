import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Typeahead from 'components/core-ui-lib/Typeahead';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
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
import DateRange from 'components/core-ui-lib/DateRange';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

type AddBookingProps = {
  formData: TForm;
  dayTypeOptions: SelectOption[];
  venueOptions: SelectOption[];
  productionCode: string;
  updateBookingConflicts: (bookingConflicts: BookingWithVenueDTO[]) => void;
  onChange: (change: Partial<TForm>) => void;
  onClose: () => void;
};

const NewBookingView = ({
  onClose,
  onChange,
  formData,
  productionCode,
  dayTypeOptions,
  venueOptions,
  updateBookingConflicts,
}: AddBookingProps) => {
  const { nextStep, activeStep, goToStep } = useWizard();
  const setViewHeader = useSetRecoilState(newBookingState);

  const currentProduction = useRecoilValue(currentProductionSelector);
  const scheduleRange = useRecoilValue(dateBlockSelector);
  const [stage, setStage] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const { loading: fetchingBookingConflicts, fetchData } = useAxios();
  const { fromDate, toDate, dateType, isDateTypeOnly, venueId, shouldFilterVenues, isRunOfDates } = formData;

  const bookingTypeValue = useMemo(
    () => (isDateTypeOnly ? BookingTypeMap.DATE_TYPE : BookingTypeMap.VENUE),
    [isDateTypeOnly],
  );

  useEffect(() => {
    setViewHeader({ stepIndex: activeStep });
  }, [activeStep]);

  const [minDate, maxDate] = useMemo(() => [scheduleRange?.scheduleStart, scheduleRange?.scheduleEnd], [scheduleRange]);

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
    <div className="w-[385px]">
      <div className="text-primary-navy text-xl my-2 font-bold">{productionCode}</div>
      <form className="flex flex-col bg-primary-navy py-3 pl-4 pr-5 rounded-lg" onSubmit={handleOnSubmit}>
        <DateRange
          label="Date"
          className=" bg-white my-2 w-fit"
          onChange={({ from, to }) => {
            onChange({
              fromDate: from?.toISOString() || '',
              toDate: !toDate && !to ? from?.toISOString() : to?.toISOString() || '',
            });
          }}
          value={{ from: fromDate ? new Date(fromDate) : null, to: toDate ? new Date(toDate) : null }}
          minDate={minDate ? new Date(minDate) : null}
          maxDate={maxDate ? new Date(maxDate) : null}
        />
        {!isDateTypeOnly && (
          <div className="flex items-center gap-2 my-1 justify-start">
            <Checkbox
              className="!w-fit"
              id="shouldFilterVenues"
              labelClassName="text-white w-fit"
              onChange={(e: any) => onChange({ isRunOfDates: e.target.checked })}
              checked={isRunOfDates}
              label="This is a run of dates. Y/N"
            />
            <Tooltip
              body="A run of dates is a single booking over multiple days. Ie a week of performances at one venue. If this is not selected, each date will be considered a separate booking."
              position="right"
              width="w-[140px]"
              bgColorClass="bg-slate-500"
            >
              <Icon iconName="info-circle-solid" />
            </Tooltip>
          </div>
        )}
        <Select
          className="w-[160px] my-2 !border-0"
          value={bookingTypeValue}
          options={BookingTypes}
          onChange={(v) =>
            onChange({
              venueId: NaN,
              dateType: NaN,
              isDateTypeOnly: v === BookingTypeMap.DATE_TYPE,
              isRunOfDates: v === BookingTypeMap.DATE_TYPE ? false : isRunOfDates,
            })
          }
        />
        {isDateTypeOnly && (
          <>
            <Typeahead
              className={'my-2 w-full !border-0'}
              options={dayTypeOptions}
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
              className={classNames('my-2 w-full !border-0')}
              options={venueOptions}
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
            <div
              className={classNames('w-full', { 'cursor-not-allowed caret-primary-input-text': !(fromDate && toDate) })}
            >
              <Button
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
            'cursor-not-allowed caret-primary-input-text': !(venueId || dateType) || !fromDate || !toDate,
          })}
        >
          <Button
            onClick={() => null}
            disabled={!(venueId || dateType) || !fromDate || !toDate}
            className="px-6"
            text={'Check Mileage'}
          ></Button>
        </div>
        <Button className="px-8" onClick={onModalClose} variant="secondary" text={'Cancel'}></Button>
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
              text={'Next'}
            ></Button>
          </div>
        )}
        {fetchingBookingConflicts && <Loader variant={'sm'} />}
      </div>
    </div>
  );
};

export default NewBookingView;
