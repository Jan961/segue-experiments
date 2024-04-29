import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useMemo, useState } from 'react';
import { productionJumpState } from 'state/booking/productionJumpState';
import TasksButtons from './TasksButtons';
import DateRange from 'components/core-ui-lib/DateRange';
import { statusOptions } from 'config/tasks';
import { tasksfilterState, intialTasksState } from 'state/tasks/tasksFilterState';
import ProductionOption from 'components/global/nav/ProductionOption';
import { ARCHIVED_OPTION_STYLES } from 'components/global/nav/ProductionJumpMenu';
import { userState } from 'state/account/userState';
import Checkbox from 'components/core-ui-lib/Checkbox';

type FilterProps = {
  onApplyFilters: () => void;
};


const Filters = ({ onApplyFilters }: FilterProps) => {
  const [filter, setFilter] = useRecoilState(tasksfilterState);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  


  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  const onClearFilters = () => {
    setFilter({
      ...intialTasksState,
      startDueDate: filter.startDueDate,
      endDueDate: filter.endDueDate,
    });
  };

  useEffect(() => {
    onApplyFilters();
  }, [filter])

  const { startDueDate, endDueDate } = filter || {};

  const { users } = useRecoilValue(userState);

  const userList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );

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

  const { selected } = productionJump;

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
                    value={selected}
                    label="Production"
                    placeholder="Please select a Production"
                    renderOption={(option) => <ProductionOption option={option} />}
                    customStyles={ARCHIVED_OPTION_STYLES}
                    options={productions}
                    onChange={gotoTasks}
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
          </div>
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
              value={{ from: startDueDate, to: endDueDate }}
            // minDate={scheduleStartDate}
            // maxDate={scheduleEndDate}
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
            options={userList}
          />
          <TextInput
            id={'taskText'}
            disabled={!ProductionId}
            placeholder="Search Production Task List..."
            className="w-[310px]"
            iconName="search"
            value={filter.taskText}
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
