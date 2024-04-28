import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Report from 'components/bookings/modal/Report';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState, intialBookingFilterState } from 'state/booking/filterState';
import { useState } from 'react';
import { allStatusOptions } from 'config/bookings';
import { productionJumpState } from 'state/booking/productionJumpState';
import useMileageCalculator from 'hooks/useBookingMileageCalculator';
import TasksButtons from './TasksButtons';
import DateRange from 'components/core-ui-lib/DateRange';
import { statusOptions } from 'config/tasks';

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading: isMileageLoading } = useMileageCalculator();
  const [showProductionSummary, setShowProductionSummary] = useState(false);
  // const todayOnSchedule = useMemo(
  //   () =>
  //     schedule.Sections.map((x) => x.Dates)
  //       .flat()
  //       .filter((x) => x.Date === todayKey).length > 0,
  //   [schedule.Sections, todayKey],
  // );

  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };
  // const gotoToday = () => {
  //   const dateToScrollTo = moment(new Date()).format('ddd DD/MM/YY');
  //   if (todayOnSchedule) {
  //     setFilter({ ...filter, scrollToDate: dateToScrollTo });
  //   }
  // };

  const onClearFilters = () => {
    setFilter({
      ...intialBookingFilterState,
      startDate: filter.scheduleStartDate,
      endDate: filter.scheduleEndDate,
      scheduleStartDate: filter.scheduleStartDate,
      scheduleEndDate: filter.scheduleEndDate,
    });
  };

  const { startDate, endDate, scheduleStartDate, scheduleEndDate } = filter || {};

  return (
    <div className="w-full flex items-center justify-between flex-wrap">
      <div className="mx-0">
        <div className="px-4">
          <GlobalToolbar
            searchFilter={filter.venueText}
            setSearchFilter={(venueText) => setFilter({ venueText })}
            titleClassName="text-primary-yellow"
            title={'Production Task Lists'}
          >
            <div className="flex items-center gap-4">
              <Report
                visible={showProductionSummary}
                onClose={() => setShowProductionSummary(false)}
                ProductionId={ProductionId}
              />
            </div>
          </GlobalToolbar>
        </div>
        <div className="px-4 flex items-center gap-4 flex-wrap  py-1">
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            disabled={!ProductionId}
            value={filter.status}
            className="bg-white w-[310px]"
            label="Status"
            options={statusOptions}
          />
          <div className="bg-white w-[310px]">
            <DateRange
              disabled={!ProductionId}
              className="bg-primary-white justify-between"
              label="Date"
              onChange={onChange}
              value={{ from: startDate, to: endDate }}
              minDate={scheduleStartDate}
              maxDate={scheduleEndDate}
            />
          </div>
        </div>
        <div className="px-4 flex items-center gap-4 flex-wrap  py-1 mt-2">
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            disabled={!ProductionId}
            value={filter.status}
            className="bg-white w-[310px]"
            label="Assigned to"
            options={allStatusOptions}
          />
          <TextInput
            id={'venueText'}
            disabled={!ProductionId}
            placeholder="Search Production Task List..."
            className="w-[310px]"
            iconName="search"
            value={filter.venueText}
            onChange={onChange}
          />
          <Button className="text-sm leading-8 w-[120px]" text="Clear Filters" onClick={onClearFilters} />
        </div>
      </div>
      <div className="px-4">
        <TasksButtons />
      </div>
    </div>
  );
};

export default Filters;
