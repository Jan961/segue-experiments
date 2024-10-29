import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Report from 'components/bookings/modal/Report';
import Select from 'components/core-ui-lib/Select';
import BookingFilter from './BookingFilter';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState, intialBookingFilterState } from 'state/booking/filterState';
import { useMemo, useState } from 'react';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';
import { allStatusOptions } from 'config/bookings';
import { productionJumpState } from 'state/booking/productionJumpState';
import moment from 'moment';
import useMileageCalculator from 'hooks/useBookingMileageCalculator';
import BookingsButtons from './BookingsButton';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';

interface FiltersProps {
  onExportClick?: (key: string) => void;
}

const Filters = ({ onExportClick }: FiltersProps) => {
  const permissions = useRecoilValue(accessBookingsHome);
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
    <div className="w-full flex items-center justify-between flex-wrap">
      <div className="mx-0">
        <div className="px-4">
          <GlobalToolbar
            searchFilter={filter.venueText}
            setSearchFilter={(venueText) => setFilter({ venueText })}
            titleClassName="text-primary-orange"
            title="Bookings"
          >
            <div className="flex items-center gap-4">
              <Button
                testId="booking-filters-gototoday"
                disabled={!todayOnSchedule || !ProductionId}
                text="Go To Today"
                className="text-sm leading-8 w-[120px]"
                onClick={() => gotoToday()}
              />
              <Button
                testId="booking-filters-tour-summary"
                text="Tour Summary"
                disabled={ProductionId === -1 || !ProductionId || !permissions.includes('ACCESS_TOUR_SUMMARY')}
                className="text-sm leading-8 w-[120px]"
                onClick={() => setShowProductionSummary(true)}
              />
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
        <div className="px-4 flex items-center gap-4 flex-wrap">
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            disabled={!ProductionId}
            value={filter.status}
            className="bg-white w-52"
            label="Status"
            options={allStatusOptions}
            testId="booking-status-filter"
            isClearable={false}
          />
          <BookingFilter />
          <TextInput
            testId="booking-filters-search"
            id="venueText"
            disabled={!ProductionId}
            placeholder="Search bookings..."
            className="w-[310px]"
            iconName="search"
            value={filter.venueText}
            onChange={onChange}
          />
          <Button
            testId="booking-filters-clear-filters"
            className="text-sm leading-8 w-[120px]"
            text="Clear Filters"
            onClick={onClearFilters}
          />
        </div>
      </div>
      <BookingsButtons onExportClick={onExportClick} />
    </div>
  );
};

export default Filters;
