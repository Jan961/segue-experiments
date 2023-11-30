import React from 'react';
import TaskEditor from './editors/TaskEditor';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { tourState } from 'state/tasks/tourState';
import { useRecoilValue } from 'recoil';
import { FormInputDate } from 'components/global/forms/FormInputDate';
import { dateToPicker, dateToSimple, getKey } from 'services/dateService';

const Toolbar: React.FC = () => {
  const [addTaskOpen, setAddTaskOpen] = React.useState(false);
  const [addRecurringTaskOpen, setAddRecurringTaskOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ Search: '', Tour: undefined });
  const tours = useRecoilValue(tourState);

  const handleOnChange = (e) => {
    e.persist();

    setFilters((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const tourOptions = tours.map((x) => ({ text: `${x.ShowCode}${x.Code}`, value: x.Id }));

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
        <div className='flex gap-2'>
          <ToolbarButton className="mb-2" onClick={() => setAddRecurringTaskOpen(true)}>
            Add Recurring Task
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={() => setAddTaskOpen(true)}>
            Add Task
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={() => setFilters({ Search: '', Tour: undefined })}>
            Show All
          </ToolbarButton>
          <ToolbarButton className="mb-2" onClick={() => setAddTaskOpen(true)}>
            Report
          </ToolbarButton>
          <FormInputText placeholder="Search" onChange={handleOnChange} name="Search" value={filters.Search} />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className='flex'>
          <p>Due date</p>
          {/* <FormInputDate name="Date" label="Date" onChange={handleOnChange} /> */}
        </div>
        <div className='flex'>
          <p>to</p>
        </div>
        <div className='flex'>
          <p>Asignee</p>
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="Tour"
            value={filters.Tour}
            options={tourOptions}
          />
        </div>
        <div className='flex'>
          <p>Status</p>
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="Tour"
            value={filters.Tour}
            options={tourOptions}
          />
        </div>
        <ToolbarButton className="mb-2" onClick={() => applyFilters()}>
          Submit
        </ToolbarButton>

      </div>
      <div>
        {addTaskOpen && <TaskEditor open={addTaskOpen} triggerClose={() => setAddTaskOpen(false)} />}
        {addRecurringTaskOpen && (<TaskEditor recurring open={addRecurringTaskOpen} triggerClose={() => setAddRecurringTaskOpen(false)} tours={tours} />)}
      </div>
    </div>
  );
};

export default Toolbar;
