import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState } from 'recoil';
import { useMemo, useState } from 'react';
import { productionJumpState } from 'state/booking/productionJumpState';
import TasksButtons from './TasksButtons';
import DateRange from 'components/core-ui-lib/DateRange';
import { statusOptions } from 'config/tasks';
import { tasksfilterState, intialTasksState } from 'state/tasks/tasksFilterState';
import ProductionOption from 'components/global/nav/ProductionOption';
import { ARCHIVED_OPTION_STYLES } from 'components/global/nav/ProductionJumpMenu';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

interface FiltersProps {
  usersList: SelectOption[]
};

const Filters = ({ usersList }: FiltersProps) => {

  const [filter, setFilter] = useRecoilState(tasksfilterState);

  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
    console.log(filter, usersList)
  };

  const onClearFilters = () => {
    setFilter({
      ...intialTasksState,
      startDueDate: null,
      endDueDate: null,
      production: null,
      assignee: -1,
      status: 'all'
    });
  };

  const { startDueDate, endDueDate } = filter || {};

  const [productionJump, setProductionJump] = useRecoilState(productionJumpState);
  const [includeArchived, setIncludeArchived] = useState<boolean>(productionJump?.includeArchived || false);

  const productions = useMemo(() => {
    const productionOptions = [{ text: 'All Productions', value: -1, Id: -1, ShowCode: null, Code: null, IsArchived: false }];
    for (const production of productionJump.productions) {
      if (includeArchived) {
        productionOptions.push({
          Id: -1,
          ShowCode: null,
          Code: null,
          IsArchived: false,
          ...production,
          text: `${production.ShowCode}${production.Code} ${production.ShowName} ${production.IsArchived ? ' (A)' : ''
            }`,
          value: production.Id,
        });
      } else if (!production.IsArchived) {
        productionOptions.push({
          Id: -1,
          ShowCode: null,
          Code: null,
          IsArchived: false,
          ...production,
          text: `${production.ShowCode}${production.Code} ${production.ShowName} ${production.IsArchived ? ' (A)' : ''
            }`,
          value: production.Id,
        });
      }
    }
    return productionOptions;
  }, [productionJump, includeArchived]);

  const gotoTasks = (productionId?: number) => {
    const selectedProduction = productions.find((production) => production.Id === productionId);
    if (!selectedProduction) {
      setProductionJump({ ...productionJump, loading: true, selected: null });
      // router.push(`/tasks/all`);/
      return;
    }
    const { Id } = selectedProduction;
    setProductionJump({ ...productionJump, loading: true, selected: Id });
    // router.push(`/tasks/${ShowCode}/${ProductionCode}`);
  };

  console.log(gotoTasks)
  const onIncludeArchiveChange = (e) => {
    setProductionJump({ ...productionJump, includeArchived: e.target.value });
    setIncludeArchived(e.target.value);
  };

  return (
    <div className="w-full flex items-center justify-between flex-wrap">
      <div className="mx-0">
        <div className="px-4">
          <div className="py-2 flex flex-row items-center gap-4">
            <h1 className={`text-4xl font-bold text-primary-yellow`}>Production Task Lists</h1>
            <div className="bg-white border-primary-border rounded-md border shadow-md">
              <div className="rounded-l-md">
                <div className="flex items-center">
                  <Select
                    className="border-0 !shadow-none w-[420px]"
                    value={filter.production}
                    label="Production"
                    placeholder="Please select a Production"
                    renderOption={(option) => <ProductionOption option={option} />}
                    customStyles={ARCHIVED_OPTION_STYLES}
                    options={productions}
                    onChange={(value) => onChange({ target: { id: 'production', value } })}
                    isSearchable
                    isClearable={false}
                  />
                  <div className="flex  items-center ml-1 mr-4">
                    <Checkbox
                      id="IncludeArchived"
                      label="Include archived"
                      checked={includeArchived}
                      onChange={onIncludeArchiveChange}
                      className=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <TextInput
              id={'taskText'}
              disabled={!filter.production}
              placeholder="Search Production Task List..."
              className="w-[310px]"
              iconName="search"
              value={filter.taskText}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="px-4 flex items-center gap-4 flex-wrap  py-1">
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            disabled={!filter.production}
            value={filter.status}
            className="bg-white w-[310px]"
            label="Status"
            options={statusOptions}
          />
          <div className="bg-white w-[420px]">
            <DateRange
              disabled={!filter.production}
              className="bg-primary-white justify-between"
              label="Date"
              onChange={onChange}
              value={{ from: startDueDate, to: endDueDate }}
            // minDate={scheduleStartDate}
            // maxDate={scheduleEndDate}
            />
          </div>
          <Select
            onChange={(value) => onChange({ target: { id: 'assignee', value } })}
            disabled={!filter.production}
            value={filter.assignee}
            className="bg-white w-[450px]"
            label="Assigned to"
            options={usersList}
          />
        </div>
      </div>
      <div className="px-4 flex items-center gap-4 flex-wrap  py-1 mt-2">
        <Button className="text-sm leading-8 w-[120px]" text="Clear Filters" onClick={onClearFilters} />
        <Button text="Master Task List" className="w-[155px]" onClick={null} />
        <Button
          text="Tasks Reports"
          className="w-[155px]"
          iconProps={{ className: 'h-4 w-3' }}
          sufixIconName={'excel'}
          onClick={null}
        />
        <Button onClick={null} text="Add Task" className="w-[155px]" />
      </div>
    </div>
  );
};

export default Filters;
