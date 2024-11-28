import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import DateRange from 'components/core-ui-lib/DateRange';
import { statusOptions } from 'config/tasks';
import { tasksfilterState, intialTasksState } from 'state/tasks/tasksFilterState';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { useRouter } from 'next/router';
import GlobalToolbar from 'components/toolbar';
import { productionJumpState } from 'state/booking/productionJumpState';
import TaskReports from './modals/TaskReports';
import { useEffect, useState } from 'react';
import { UTCDate } from '@date-fns/utc';

interface FiltersProps {
  usersList: SelectOption[];
  handleShowTask?: () => void;
}

const Filters = ({ usersList, handleShowTask }: FiltersProps) => {
  const [filter, setFilter] = useRecoilState(tasksfilterState);
  const { selected } = useRecoilValue(productionJumpState);
  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  const onDateChange = (change: { from: UTCDate; to: UTCDate }) => {
    const { from: startDueDate, to: endDueDate } = change;
    setFilter({ ...filter, startDueDate, endDueDate });
  };

  const onClearFilters = () => {
    setFilter({
      ...intialTasksState,
      startDueDate: null,
      endDueDate: null,
      assignee: -1,
      status: 'all',
      production: selected,
    });
  };

  useEffect(() => {
    if (selected !== filter.production) {
      onClearFilters();
    }
  }, [selected]);

  const { startDueDate, endDueDate } = filter || {};
  const router = useRouter();

  const [showReports, setShowReports] = useState<boolean>(false);

  const handleShowReports = () => {
    setShowReports(!showReports);
  };

  return (
    <div className="w-full flex justify-between">
      <div className="mx-0">
        <div className="px-4">
          <GlobalToolbar
            searchFilter={filter.taskText}
            setSearchFilter={(taskText) => setFilter({ taskText })}
            titleClassName="text-primary-yellow"
            title="Production Task Lists"
          >
            <TextInput
              id="taskText"
              disabled={!selected}
              placeholder="Search Production Task List..."
              className="w-[240px]"
              iconName="search"
              value={filter.taskText}
              onChange={onChange}
            />
          </GlobalToolbar>
        </div>
        <div className="px-4 flex items-center gap-4 py-1">
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            disabled={!selected}
            value={filter.status}
            className="bg-primary-white w-[308px]"
            label="Status"
            options={statusOptions}
          />
          <div className="bg-primary-white">
            <DateRange
              disabled={!selected}
              className="bg-primary-white justify-between"
              label="Date"
              onChange={onDateChange}
              value={{ from: startDueDate, to: endDueDate }}
            />
          </div>
          <Select
            onChange={(value) => onChange({ target: { id: 'assignee', value } })}
            disabled={!selected}
            value={filter.assignee}
            className="bg-primary-white w-[380px]"
            label="Assigned to"
            options={usersList}
          />
          <Button className="text-sm leading-8 w-[132px]" text="Clear Filters" onClick={onClearFilters} />
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-4 max-w-[280px] py-2 mt-1.5">
        <Button text="Tasks Reports" className="w-[132px]" sufixIconName="excel" onClick={handleShowReports} />
        <Button text="Master Task List" className="w-[132px]" onClick={() => router.push('/tasks/master')} />
        <div />
        <Button
          onClick={handleShowTask}
          disabled={!selected || selected === -1}
          text="Add Task"
          className="w-[132px] mt-[1px]"
        />
      </div>
      <TaskReports visible={showReports} onClose={handleShowReports} />
    </div>
  );
};

export default Filters;
