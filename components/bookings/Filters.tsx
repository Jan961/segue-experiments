import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Report from 'components/bookings/modal/Report';
import Select from 'components/core-ui-lib/Select';
import BookingFilter from './BookingFilter';
import TextInput from 'components/core-ui-lib/TextInput';
import BookingsButtons from './bookingsButtons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState, intialBookingFilterState } from 'state/booking/filterState';

import { useMemo, useState } from 'react';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';
import { statusOptions } from 'config/bookings';
import { productionJumpState } from 'state/booking/productionJumpState';
import moment from 'moment';
import useMileageCalculator from 'hooks/useBookingMileageCalculator';

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);

  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const schedule = useRecoilValue(filteredScheduleSelector);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading: isMileageLoading } = useMileageCalculator();
  const [showProductionSummary, setShowProductionSummary] = useState(false);
  const todayKey = useMemo(() => new Date().toISOString().substring(0, 10), []);
  const todayOnSchedule = useMemo(
    () =>
      schedule.Sections.map((x) => x.Dates)
        .flat()
        .filter((x) => x.Date === todayKey).length > 0,
    [schedule.Sections, todayKey],
  );

  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };
  const gotoToday = () => {
    const dateToScrollTo = moment(new Date()).format('ddd DD/MM/YY');
    if (todayOnSchedule) {
      setFilter({ ...filter, scrollToDate: dateToScrollTo });
    }
  };

  const onClearFilters = () => {
    setFilter({
      ...intialBookingFilterState,
      startDate: filter.scheduleStartDate,
      endDate: filter.scheduleEndDate,
      scheduleStartDate: filter.scheduleStartDate,
      scheduleEndDate: filter.scheduleEndDate,
    });
  };
  return (
    <div className="w-full flex items-center justify-between">
      <div className="mx-0">
        <div className="px-4">
          <GlobalToolbar
            searchFilter={filter.venueText}
            setSearchFilter={(venueText) => setFilter({ venueText })}
            titleClassName="text-primary-orange"
            title={'Bookings'}
          >
            <div className="flex items-center gap-4">
              <Button
                disabled={!todayOnSchedule || !ProductionId}
                text="Go To Today"
                className="text-sm leading-8 w-[120px]"
                onClick={() => gotoToday()}
              ></Button>
              <Button
                text="Tour Summary"
                disabled={ProductionId === -1 || !ProductionId}
                className="text-sm leading-8 w-[120px]"
                onClick={() => setShowProductionSummary(true)}
              ></Button>
              {showProductionSummary && (
                <Report
                  visible={showProductionSummary}
                  onClose={() => setShowProductionSummary(false)}
                  ProductionId={ProductionId}
                />
              )}
            </div>
          </GlobalToolbar>
        </div>
        <div className="px-4 flex items-center gap-4 flex-wrap  py-1">
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            disabled={!ProductionId}
            value={filter.status}
            className="bg-white w-52"
            label="Status"
            options={statusOptions}
          />
          <BookingFilter />
          <TextInput
            id={'venueText'}
            disabled={!ProductionId}
            placeHolder="Search bookings..."
            className="w-[310px]"
            iconName="search"
            value={filter.venueText}
            onChange={onChange}
          />
          <Button className="text-sm leading-8 w-[120px]" text="Clear Filters" onClick={onClearFilters}></Button>
        </div>
      </div>
      <BookingsButtons />
    </div>
  );
};

export default Filters;
