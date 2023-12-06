import React, { useState, useEffect } from 'react';
import TaskEditor from './editors/TaskEditor';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { tourState, ToursWithTasks } from 'state/tasks/tourState';
import { useRecoilValue } from 'recoil';

interface ToolbarProps {
  setSelectedTour: React.Dispatch<React.SetStateAction<number | undefined>>;
  onFilterChange: (filters: any) => void;
  onSearch: (searchFilter: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ setSelectedTour, onFilterChange, onSearch }) => {
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addRecurringTaskOpen, setAddRecurringTaskOpen] = useState(false);
  const [filters, setFilters] = useState({ Tour: undefined, Status: undefined, Assignee: undefined });
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const tours = useRecoilValue(tourState);
  const [filteredTasks, setFilteredTasks] = useState<ToursWithTasks[]>([]);

  const applyFilters = () => {
    const searchTerm = searchFilter.toLowerCase();
    const filteredTours = tours.filter((tour) => {
      const matchesTour = !filters.Tour || filters.Tour === tour.Id;
      const matchesStatus =
        !filters.Status ||
        tour.Tasks.some((task) =>
          (filters.Status === 'todo' && task.Progress === 0) ||
          (filters.Status === 'inProgress' && task.Progress > 0 && task.Progress < 100) ||
          (filters.Status === 'complete' && task.Progress === 100)
        );
      const matchesAssignee = !filters.Assignee || filters.Assignee === tour.Assignee;
      const matchesSearch = !searchFilter || tour.Tasks.some((task) => task.TaskName.toLowerCase().includes(searchTerm));
  
      return matchesTour && matchesStatus && matchesAssignee && matchesSearch;
    });
  
    setFilteredTasks(filteredTours);
    onFilterChange({ ...filters, Search: searchFilter });
  };
  

  const clearFilters = () => {
    setFilters({ Tour: undefined, Status: undefined, Assignee: undefined });
    setSearchFilter('');
    setSelectedTour(undefined);
    setFilteredTasks([]);
    onFilterChange({});
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));

    if (id === 'Tour') {
      setSelectedTour(parseInt(value, 10));
    } else if (id === 'searchTasks') {
      setSearchFilter(value);
    }
  };

  const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = searchFilter.toLowerCase();
      const filteredTours = tours.filter((tour) =>
        tour.Tasks && tour.Tasks.some((task) => task.TaskName && task.TaskName.toLowerCase().includes(searchTerm))
      );
      setFilteredTasks(filteredTours);
      onFilterChange({ ...filters, Search: searchFilter });
      onSearch(searchFilter);
      console.log('search term:' + searchTerm + searchFilter);
      console.log(filteredTours);
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const tourOptions = tours.map((x) => ({ text: `${x.ShowCode}${x.Code}`, value: x.Id }));

  const statusOptions = [
    { text: 'To do', value: 'todo' },
    { text: 'In progress', value: 'inProgress' },
    { text: 'Complete', value: 'complete' },
  ];

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div>
      <div className="flex flex-row gap-2 justify-end items-center">
        <FormInputSelect
          className="w-80"
          onChange={handleOnChange}
          name="Tour"
          value={filters.Tour}
          options={tourOptions}
        />
        <div className="flex gap-2">
          <ToolbarButton className="mb-2" onClick={() => setAddRecurringTaskOpen(true)} disabled>
            Add Recurring Task
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={() => setAddTaskOpen(true)}>
            Add Task
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={clearFilters}>
            Show All
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={() => setAddTaskOpen(true)}>
            Report
          </ToolbarButton>
          <FormInputText
            placeholder="Search Tasks"
            onChange={handleOnChange}
            onKeyDown={handleSearchOnEnter}
            name="searchTasks"
            value={searchFilter}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2">
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="Status"
            value={filters.Status}
            options={statusOptions}
          />
        <ToolbarButton className="mb-2" onClick={applyFilters}>
          Submit
        </ToolbarButton>
      </div>
      <div>
        {addTaskOpen && <TaskEditor open={addTaskOpen} triggerClose={() => setAddTaskOpen(false)} />}
        {addRecurringTaskOpen && (
          <TaskEditor recurring open={addRecurringTaskOpen} triggerClose={() => setAddRecurringTaskOpen(false)} tours={tours} />
        )}
      </div>
    </div>
  );
};

export default Toolbar;
