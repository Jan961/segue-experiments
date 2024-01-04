import React, { useState, useMemo } from 'react';
import TaskEditor from './editors/TaskEditor';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { FormInputDate } from 'components/global/forms/FormInputDate';
import { useRecoilState, useRecoilValue } from 'recoil';
import { statusOptions } from 'config/tasks';
import { userState } from 'state/account/userState';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { tourJumpState } from 'state/booking/tourJumpState';
import { useRouter } from 'next/router';

type ToolbarProps = {
  onApplyFilters: () => void;
};

const Toolbar = ({ onApplyFilters }: ToolbarProps) => {
  const router = useRouter();
  const [addTaskOpen, setAddTaskOpen] = useState<boolean>(false);
  const [addRecurringTaskOpen, setAddRecurringTaskOpen] = useState<boolean>(false);
  const { users } = useRecoilValue(userState);
  const [filters, setFilters] = useRecoilState(tasksfilterState);
  const userList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );
  const [tourJump, setTourJump] = useRecoilState(tourJumpState);
  const { tours } = tourJump;
  const tourOptions = [
    { text: 'All', value: null },
    ...(tours?.filter?.((tour) => !tour.IsArchived).map((x) => ({ text: `${x.ShowCode}${x.Code}`, value: x.Id })) ||
      []),
  ];
  const gotoTour = (tourId?: number) => {
    const selectedTour = tours.find((tour) => tour.Id === tourId);
    if (!selectedTour) {
      setTourJump({ ...tourJump, loading: true, selected: null });
      router.push(`/tasks/all`);
      return;
    }
    const { ShowCode, Code: TourCode, Id } = selectedTour;
    setTourJump({ ...tourJump, loading: true, selected: Id });
    router.push(`/tasks/${ShowCode}/${TourCode}`);
  };

  const clearFilters = () => {
    setFilters({});
    setTourJump({ ...tourJump, loading: true, selected: null });
    router.push(`/tasks/all`);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value }: { name: string; value: any } = e.target;
    if (name === 'tour') {
      value = parseInt(value, 10);
    }
    setFilters({ ...filters, [name]: value });
    if (name === 'tour') gotoTour(value);
  };

  const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onApplyFilters();
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <div className="grow">
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="tour"
            value={tourJump.selected}
            options={tourOptions}
          />
        </div>
        <div className="flex gap-4">
          <ToolbarButton
            className="mb-2 bg-white !text-primary-purple !font-bold"
            onClick={() => setAddRecurringTaskOpen(true)}
            disabled
          >
            Add Recurring Task
          </ToolbarButton>
          <ToolbarButton className="mb-2 bg-white !text-primary-purple !font-bold" onClick={() => setAddTaskOpen(true)}>
            Add Task
          </ToolbarButton>
          <ToolbarButton className="mb-2 bg-white !text-primary-purple !font-bold" onClick={clearFilters}>
            Show All
          </ToolbarButton>
          <ToolbarButton className="mb-2 bg-white !text-primary-purple !font-bold">Report</ToolbarButton>
        </div>
        <div className="flex gap-2 grow">
          <FormInputText
            placeholder="Search Tasks"
            onChange={handleOnChange}
            onKeyDown={handleSearchOnEnter}
            name="taskText"
            value={filters?.taskText}
            className="flex-grow"
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center	">
          <p className="mr-3 font-light text-sm mb-2">Due date</p>
          {/* JAS NOTES: HARD CODED FOR TESTING PURPOSES  */}
          <FormInputDate name="startDueDate" label="" onChange={handleOnChange} value={filters?.startDueDate} />
        </div>
        <div className="flex items-center mb-2">
          <p className="mr-3 font-light	text-sm">to</p>
          <FormInputDate name="endDueDate" label="" onChange={handleOnChange} value={filters?.endDueDate} />
        </div>
        <div className="flex items-center">
          <p className="mr-3 font-light text-sm mb-2">Asignee</p>
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="assignee"
            value={filters?.assignee}
            options={[{ text: '', value: null }, ...userList]}
          />
        </div>
        <div className="flex items-center">
          <p className="mr-3 font-light	text-sm mb-2">Status</p>
          <FormInputSelect
            className="w-80"
            onChange={handleOnChange}
            name="status"
            value={filters?.status}
            options={statusOptions}
          />
        </div>
        <ToolbarButton className="mb-2 bg-white !text-primary-purple !font-bold" onClick={onApplyFilters}>
          Submit
        </ToolbarButton>
      </div>
      <div>
        {addTaskOpen && <TaskEditor open={addTaskOpen} triggerClose={() => setAddTaskOpen(false)} />}
        {addRecurringTaskOpen && (
          <TaskEditor recurring open={addRecurringTaskOpen} triggerClose={() => setAddRecurringTaskOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default Toolbar;
