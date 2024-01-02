import React, { useState, useEffect } from 'react';
import TaskEditor from './editors/TaskEditor';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { FormInputDate } from 'components/global/forms/FormInputDate';
import { tourState } from 'state/tasks/tourState';
import { useRecoilValue } from 'recoil';

interface ToolbarProps {
  setSelectedTour: React.Dispatch<React.SetStateAction<number | undefined>>;
  onFilterChange: (filters: any) => void;
  onSearch: (searchFilter: string) => void;
  selectedStatus: string | undefined;
  onStatusChange: (status: string) => void;
}

const Toolbar = ({ setSelectedTour, onFilterChange, onSearch, selectedStatus, onStatusChange }: ToolbarProps) => {
  const [addTaskOpen, setAddTaskOpen] = useState<boolean>(false);
  const [addRecurringTaskOpen, setAddRecurringTaskOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({ Tour: undefined, Status: undefined, Assignee: undefined });
  const [searchFilter, setSearchFilter] = useState('');
  const [localStatus, setLocalStatus] = useState<string | undefined>(selectedStatus);
  const [dueDate, setDueDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const tours = useRecoilValue(tourState);

  const clearFilters = () => {
    setFilters({ Tour: 'Show / Tour', Status: '', Assignee: undefined });
    setSelectedTour(undefined);
    setLocalStatus(undefined); // Clear local status
    onStatusChange(undefined); // Update parent component's status
    onFilterChange({});
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // JAS NOTE: This page needs to be updated to take the dyanmic routing into account
    const { name, value } = e.target;
    if (name === 'Tour') {
      if (value === 'Show / Tour') {
        clearFilters();
      } else {
        setFilters((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
        setSelectedTour(parseInt(value, 10));
      }
    } else if (name === 'searchTasks') {
      setSearchFilter(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }

    if (name === 'DueDate') {
      setDueDate(value);
    } else if (name === 'ToDate') {
      setToDate(value);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalStatus(e.target.value);
  };

  const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchFilter);
    }
  };

  const applyFilters = () => {
    onFilterChange({ ...filters, Search: searchFilter, Status: localStatus, DueDate: dueDate, ToDate: toDate });
    onStatusChange(localStatus);
  };

  const tourOptions = [
    { text: 'Show / Tour', value: 'Show / Tour' },
    ...tours.map((x) => ({ text: `${x.ShowCode}${x.Code}`, value: x.Id })),
  ];

  const statusOptions = [
    { text: 'All', value: 'all' },
    { text: 'To do', value: 'todo' },
    { text: 'In progress', value: 'inProgress' },
    { text: 'Complete', value: 'complete' },
  ];

  const asigneeOptions = [{ text: 'Temp', value: 'Temp' }];

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <div className="grow">
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="Tour"
            value={filters.Tour}
            options={tourOptions}
          />
        </div>
        <div className="flex gap-4">
          <ToolbarButton className="mb-2" onClick={() => setAddRecurringTaskOpen(true)} disabled>
            Add Recurring Task
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={() => setAddTaskOpen(true)}>
            Add Task
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={clearFilters}>
            Show All
          </ToolbarButton>
          <ToolbarButton className="mb-2">Report</ToolbarButton>
        </div>
        <div className="flex gap-2 grow">
          <FormInputText
            placeholder="Search Tasks"
            onChange={handleOnChange}
            onKeyDown={handleSearchOnEnter}
            name="searchTasks"
            value={searchFilter}
            className="flex-grow"
          />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex items-center	">
          <p className="mr-3 font-light text-sm">Due date</p>
          {/* JAS NOTES: HARD CODED FOR TESTING PURPOSES  */}
          <FormInputDate name="DueDate" label="" onChange={handleOnChange} value={'01/01/23'} />
        </div>
        <div className="flex items-center">
          <p className="mr-3 font-light	text-sm">to</p>
          <FormInputDate name="ToDate" label="" onChange={handleOnChange} value={'03/01/23'} className={'unstyled'} />
        </div>
        <div className="flex items-center">
          <p className="mr-3 font-light text-sm">Asignee</p>
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="Assignee"
            value={filters.Assignee}
            options={asigneeOptions}
          />
        </div>
        <div className="flex items-center">
          <p className="mr-3 font-light	text-sm">Status</p>
          <FormInputSelect
            className="w-80"
            onChange={handleStatusChange}
            name="Status"
            value={localStatus}
            options={statusOptions}
          />
        </div>
        <ToolbarButton className="mb-2" onClick={applyFilters}>
          Submit
        </ToolbarButton>
      </div>
      <div>
        {addTaskOpen && <TaskEditor open={addTaskOpen} triggerClose={() => setAddTaskOpen(false)} />}
        {addRecurringTaskOpen && (
          <TaskEditor
            recurring
            open={addRecurringTaskOpen}
            triggerClose={() => setAddRecurringTaskOpen(false)}
            tours={tours}
          />
        )}
      </div>
    </div>
  );
};

export default Toolbar;
