import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import TaskEditor from './editors/TaskEditor';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { useRecoilState, useRecoilValue } from 'recoil';
import { statusOptions } from 'config/tasks';
import { userState } from 'state/account/userState';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { tourJumpState } from 'state/booking/tourJumpState';
import { useRouter } from 'next/router';
import ExcelIcon from 'components/global/icons/excelIcon';
import { Spinner } from 'components/global/Spinner';

type ToolbarProps = {
  onApplyFilters: () => void;
};

const Toolbar = ({ onApplyFilters }: ToolbarProps) => {
  const router = useRouter();
  const [addTaskOpen, setAddTaskOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const exportTasks = () => {
    setIsLoading(true);
    fetch('/api/reports/task-list', {
      method: 'POST',
      body: JSON.stringify({
        ...filters,
        tour: tourJump.selected,
      }),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          const tourName = 'Tour Name';
          let suggestedName: string | any[] = response.headers.get('Content-Disposition');
          if (suggestedName) {
            suggestedName = suggestedName.match(/filename="(.+)"/);
            suggestedName = suggestedName.length > 0 ? suggestedName[1] : null;
          }
          if (!suggestedName) {
            suggestedName = `${tourName}.xlsx`;
          }
          const content = await response.blob();
          if (content) {
            const anchor: any = document.createElement('a');
            anchor.download = suggestedName;
            anchor.href = (window.webkitURL || window.URL).createObjectURL(content);
            anchor.dataset.downloadurl = [
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              anchor.download,
              anchor.href,
            ].join(':');
            anchor.click();
          }
        }
      })
      .catch((error) => {
        console.log('Error downloading report', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleOnChange = (e) => {
    let { name, value }: { name: string; value: any } = e.target;
    if (name === 'startDueDate' || name === 'endDueDate') value = value || '';
    if (name === 'tour' || name === 'assignee') {
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
        <FormInputSelect
          className="[&>select]:w-auto"
          onChange={handleOnChange}
          name="tour"
          value={tourJump.selected}
          options={tourOptions}
        />
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
          <ToolbarButton
            className="flex items-center gap-1 mb-2 px-2 bg-white !text-primary-purple !font-bold"
            onClick={() => exportTasks()}
          >
            <ExcelIcon height={18} width={18} />
            {isLoading ? <Spinner className="mr-2" size="sm" /> : 'Report'}
          </ToolbarButton>
        </div>
        <div className="flex gap-2">
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
      <div className="flex flex-row items-center gap-4 my-4">
        <div className="flex items-center gap-2">
          <span className="">Due date</span>
          <DatePicker
            placeholderText="DD/MM/YY"
            dateFormat="dd/MM/yy"
            popperClassName="!z-50"
            className="rounded border-gray-300 px-3 py-2 z-90"
            selected={filters?.startDueDate ? new Date(filters?.startDueDate) : null}
            onChange={(date) => handleOnChange({ target: { name: 'startDueDate', value: date.toLocaleDateString() } })}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="">To</span>
          <DatePicker
            placeholderText="DD/MM/YY"
            dateFormat="dd/MM/yy"
            popperClassName="!z-50"
            className="rounded border-gray-300 px-3 py-2 z-90"
            selected={filters?.endDueDate ? new Date(filters?.endDueDate) : null}
            minDate={filters?.startDueDate ? new Date(filters?.startDueDate) : new Date()}
            onChange={(date) => handleOnChange({ target: { name: 'endDueDate', value: date.toLocaleDateString() } })}
          />
        </div>
        <FormInputSelect
          className="w-80 !mb-0"
          onChange={handleOnChange}
          name="assignee"
          label="Assignee"
          value={filters?.assignee}
          options={[{ text: 'Select Assignee', value: null }, ...userList]}
          inline
        />
        <FormInputSelect
          className="w-80 !mb-0"
          onChange={handleOnChange}
          name="status"
          label="Status"
          value={filters?.status}
          options={statusOptions}
          inline
        />
        <ToolbarButton className="bg-white !text-primary-purple !font-bold" onClick={onApplyFilters}>
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
