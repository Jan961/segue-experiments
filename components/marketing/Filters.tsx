import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';
import { productionJumpState } from 'state/booking/productionJumpState';
import moment from 'moment';
import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Select from 'components/core-ui-lib/Select';
import Iframe from 'components/core-ui-lib/Iframe';
import MarketingButtons from './marketingButtons';
import { mapBookingsToProductionOptions } from 'mappers/productionCodeMapper';
import { bookingJumpState } from 'state/marketing/bookingJumpState';

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const schedule = useRecoilValue(filteredScheduleSelector);
  const todayKey = useMemo(() => new Date().toISOString().substring(0, 10), []);
  const todayOnSchedule = useMemo(
    () =>
      schedule.Sections.map((x) => x.Dates)
        .flat()
        .filter((x) => x.Date === todayKey).length > 0,
    [schedule.Sections, todayKey],
  );

  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState);

  const goToToday = () => {
    const dateToScrollTo = moment(new Date()).format('ddd DD/MM/YY');
    if (todayOnSchedule) {
      setFilter({ ...filter, scrollToDate: dateToScrollTo });
    }
  };

  const bookingOptions = useMemo(
    () => (bookingJump.bookings ? mapBookingsToProductionOptions(bookingJump.bookings) : []),
    [bookingJump],
  );

  const changeBooking = (value: string | number) => {
    setBookingJump({ ...bookingJump, selected: Number(value) });
  };

  console.log(JSON.stringify(filter.status));

  return (
    <div className="w-full flex items-end justify-between flex-wrap">
      <div className="flex flex-col gap-4">
        <GlobalToolbar
          searchFilter={filter.venueText}
          setSearchFilter={(venueText) => setFilter({ venueText })}
          titleClassName="text-primary-green"
          title={'Marketing'}
        />

        <div className="flex items-center gap-4">
          <Select
            onChange={changeBooking}
            value={bookingJump.selected}
            disabled={!ProductionId}
            placeholder="Select a Venue/Date"
            className="bg-white w-96"
            options={bookingOptions}
          />

          <Button
            text="Go To Today"
            disabled={!todayOnSchedule || !ProductionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToToday}
          />
          <Button
            text="Previous Date"
            disabled={!todayOnSchedule || !ProductionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToToday}
          />
          <Button
            text="Next Date"
            disabled={!todayOnSchedule || !ProductionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToToday}
          />

          {/* Iframe placed next to buttons but in the same flex container */}
          <div className="self-end -mt-[60px]">
            <Iframe variant="xs" src="https://www.gordon-craig.co.uk/" />
          </div>
        </div>
      </div>

      <MarketingButtons />
    </div>
  );
};

export default Filters;
