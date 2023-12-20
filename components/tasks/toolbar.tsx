import React from 'react';
import TaskEditor from './editors/TaskEditor';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { tourState } from 'state/tasks/tourState';
import { useRecoilValue } from 'recoil';
import ExcelIcon from 'components/global/icons/excelIcon';
import { Spinner } from 'components/global/Spinner';

const Toolbar: React.FC = () => {
  const [addTaskOpen, setAddTaskOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ Search: '', Tour: undefined });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const tours = useRecoilValue(tourState);

  const handleOnChange = (e) => {
    e.persist();

    setFilters((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const exportTasks = () => {
    setIsLoading(true);
    fetch('/api/reports/task-list', {
      method: 'POST',
      body: JSON.stringify({
        TourId: filters.Tour,
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
  const tourOptions = tours.map((x) => ({ text: `${x.ShowCode}${x.Code}`, value: x.Id }));

  return (
    <div>
      <div className="flex flex-row gap-2 justify-end items-end">
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
        <ToolbarButton className="flex items-center gap-1 mb-2 px-2" onClick={() => exportTasks()}>
          <ExcelIcon height={18} width={18} />
          Export
          {isLoading ? <Spinner className="mr-2" size="sm" /> : 'Export'}
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
