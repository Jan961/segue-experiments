import React from 'react';
import TaskEditor from './editors/TaskEditor';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { tourState } from 'state/tasks/tourState';
import { useRecoilValue } from 'recoil';

interface ToolbarProps {}

const Toolbar: React.FC<ToolbarProps> = () => {
  const [addTaskOpen, setAddTaskOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ Search: '', Tour: undefined });
  const tours = useRecoilValue(tourState);

  const handleOnChange = (e) => {
    e.persist();

    setFilters((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const tourOptions = tours.map((x) => ({ text: `${x.ShowCode}/${x.Code}`, value: x.Id }));

  return (
    <div>
      <div className="flex flex-row gap-2 justify-end items-center">
        <FormInputText placeholder="Search" onChange={handleOnChange} name="Search" value={filters.Search} />
        <FormInputSelect
          className="w-80"
          onChange={handleOnChange}
          name="Tour"
          value={filters.Tour}
          options={tourOptions}
        />
        <ToolbarButton className="mb-2" onClick={() => setAddTaskOpen(true)}>
          Add Task
        </ToolbarButton>
        {addTaskOpen && <TaskEditor open={addTaskOpen} triggerClose={() => setAddTaskOpen(false)} />}
        {/*
          <ToolbarButton onClick={() => setAddRecurringTaskOpen(true)}>Add Recurring Task</ToolbarButton>
          { addRecurringTaskOpen && (<TaskEditor recurring open={addRecurringTaskOpen} triggerClose={() => setAddRecurringTaskOpen(false)} tours={tours} />)}
        */}
      </div>
    </div>
  );
};

export default Toolbar;
