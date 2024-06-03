import { MasterTask } from '@prisma/client';
import axios from 'axios';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateInput from 'components/core-ui-lib/DateInput';
import Label from 'components/core-ui-lib/Label';
import Loader from 'components/core-ui-lib/Loader';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { isNullOrEmpty } from 'utils';
import { weekOptions } from 'utils/getTaskDateStatus';
import { priorityOptions } from 'utils/tasks';

interface AddTaskProps {
  visible: boolean;
  isMasterTask?: boolean;
  onClose: () => void;
  task?: Partial<MasterTask> & { ProductionId?: number };
}

const RepeatOptions = [
  {
    text: 'Weekly',
    value: 'weekly',
  },
  {
    text: 'Every 2 Weeks',
    value: 'biweekly',
  },
  {
    text: 'Monthly',
    value: 'monthly',
  },
];

const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Loader className="ml-2" iconProps={{ stroke: '#FFF' }} />
  </div>
);

const DEFAULT_MASTER_TASK: Partial<MasterTask> & { Progress?: number; DueDate?: string; ProductionId?: number } = {
  Id: undefined,
  Code: 0,
  Name: '',
  Notes: '',
  AssignedToUserId: null,
  Priority: 0,
  AccountId: 0,
  RepeatInterval: '',
  StartByWeekNum: 0,
  TaskStartByIsPostProduction: false,
  CompleteByWeekNum: 0,
  TaskCompleteByIsPostProduction: false,
  Progress: 0,
  DueDate: '',
  ProductionId: 0,
};

const AddTask = ({ visible, onClose, task, isMasterTask = false }: AddTaskProps) => {
  const [inputs, setInputs] = useState<
    Partial<MasterTask> & { Progress?: number; DueDate?: string; ProductionId?: number }
  >(task || DEFAULT_MASTER_TASK);

  useEffect(() => {
    setInputs(task);
  }, [task]);

  const [status, setStatus] = useState({ submitted: true, submitting: false });
  const [loading, setLoading] = useState<boolean>(false);

  const priorityOptionList = useMemo(
    () => priorityOptions.map((option) => ({ ...option, text: `${option.value} - ${option.text}` })),
    [],
  );

  const generatePercentageOptions: SelectOption[] = Array.from({ length: 101 }, (_, index) => ({
    text: index.toString(), // Ensure text is a string
    value: index.toString(),
  }));

  const { users } = useRecoilValue(userState);

  const usersList = useMemo(() => {
    if (isNullOrEmpty(users)) {
      return [];
    }

    return Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
      value: Id,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const handleOnChange = (e: any) => {
    let { id, value, checked } = e.target;
    if (
      [
        'AssignedToUserId',
        'StartByWeekNum',
        'CompleteByWeekNum',
        'Priority',
        'Progress',
        'ProductionId',
        'Code',
      ].includes(id)
    )
      value = parseInt(value, 10);

    if (id === 'RepeatInterval' && checked) {
      value = 'once';
    }

    const newInputs = { ...inputs, [id]: value };
    setInputs(newInputs);
    setStatus({ ...status, submitted: false });
  };

  const repeatInterval: boolean = inputs?.RepeatInterval === 'once';

  const handleOnSubmit = async () => {
    setLoading(true);
    if (isMasterTask) {
      try {
        const keysToDelete = ['DueDate', 'Progress', 'ProductionId'];
        for (const key of keysToDelete) {
          delete inputs[key];
        }
        if (inputs.Id) {
          await axios.post('/api/tasks/master/update', inputs);
          setLoading(false);
          onClose();
          setInputs(DEFAULT_MASTER_TASK);
        } else {
          const endpoint = '/api/tasks/master/create';
          await axios.post(endpoint, inputs);
          setLoading(false);
          onClose();
          setInputs(DEFAULT_MASTER_TASK);
        }
      } catch (error) {
        setLoading(false);
        onClose();
        setInputs(DEFAULT_MASTER_TASK);
      }
    } else {
      const keysToDelete = ['TaskCompleteByIsPostProduction', 'TaskStartByIsPostProduction'];
      for (const key of keysToDelete) {
        delete inputs[key];
      }
      if (inputs.Id) {
        try {
          await axios.post('/api/tasks/update', inputs);
          setLoading(false);
          onClose();
        } catch (error) {
          setLoading(false);
        }
      } else {
        try {
          const endpoint = '/api/tasks/create/single/';
          await axios.post(endpoint, inputs);
          setLoading(false);
          onClose();
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      }
    }
  };

  const handleClose = () => {
    onClose();
    setInputs(DEFAULT_MASTER_TASK);
  };

  return (
    <PopupModal
      show={visible}
      onClose={handleClose}
      title={inputs.Id ? 'Edit Task' : 'Create New Task'}
      titleClass="text-primary-navy text-xl mb-4"
    >
      <form className="flex flex-col gap-4">
        {loading && <LoadingOverlay />}
        <div className="col-span-2 col-start-4 flex items-center justify-between">
          <Label className="!text-secondary pr-6 " text="Task Name" />
          <TextInput
            className="w-128 placeholder-secondary"
            placeholder="Enter Task Name"
            id="Name"
            onChange={handleOnChange}
            value={inputs?.Name}
          />
        </div>
        <div className="col-span-2 col-start-4 flex items-center justify-between">
          <Label className="!text-secondary pr-6 " text="Task Code" />
          <TextInput
            id="Code"
            disabled={isMasterTask}
            className="w-128 placeholder-secondary"
            placeholder="Code is assigned when task is created"
            onChange={handleOnChange}
            value={inputs?.Code?.toString()}
          />
        </div>
        <div className="col-span-2 col-start-4 flex items-center">
          <div className="flex">
            <Label className="!text-secondary pr-6 mr-4" text="Start By" />
            <Select
              value={inputs?.StartByWeekNum}
              options={weekOptions}
              placeholder="Week No."
              onChange={(value) => handleOnChange({ target: { id: 'StartByWeekNum', value } })}
              className="w-32"
            />
          </div>
          <div className="flex ml-10">
            <Label className="!text-secondary pr-6 " text="Complete By" />
            <Select
              onChange={(value) => handleOnChange({ target: { id: 'CompleteByWeekNum', value } })}
              value={inputs?.CompleteByWeekNum}
              options={weekOptions}
              placeholder="Week No."
              className="w-32"
            />
          </div>
        </div>
        <div className="col-span-2 col-start-4 flex items-center">
          <div className="flex">
            <Label className="!text-secondary pr-6 mr-4" text="Priority" />
            <Select
              onChange={(value) => handleOnChange({ target: { id: 'Priority', value } })}
              value={inputs?.Priority}
              className="w-32"
              placeholder="Priority"
              options={priorityOptionList}
            />
          </div>
          <div className="flex ml-2">
            <Label className="!text-secondary pr-6" text="Progress" />
            <Select
              disabled={isMasterTask}
              onChange={(value) => handleOnChange({ target: { id: 'Progress', value } })}
              value={inputs?.Progress}
              placeholder="Progress"
              className="w-20"
              options={generatePercentageOptions}
            />
          </div>
          <div className="flex ml-2">
            <Label className="!text-secondary pr-6" text="Completed on" />
            <DateInput
              disabled={isMasterTask}
              value={inputs?.DueDate}
              onChange={(value) => handleOnChange({ target: { id: 'DueDate', value } })}
            />
          </div>
        </div>
        <h3 className="font-bold text-xl mt-4">Occurrence</h3>
        <div className="col-span-2 col-start-4 flex items-center">
          <div className="flex">
            <Label className="!text-secondary pr-2" text="Only Once" />
            <Checkbox
              id="RepeatInterval"
              checked={repeatInterval}
              onChange={(event) => handleOnChange({ target: { id: 'RepeatInterval', checked: event.target.checked } })}
            />
          </div>
          <div className="flex">
            <Label className="!text-secondary px-2" text="Repeat" />
            <Select
              onChange={(value) => handleOnChange({ target: { id: 'RepeatInterval', value } })}
              value={inputs?.RepeatInterval}
              className="w-32"
              options={RepeatOptions}
              placeholder="Week No."
              disabled={repeatInterval}
            />
          </div>
          <div className="flex ml-2">
            <Label className="!text-secondary pr-2" text="From" />
            <Select
              onChange={(value) => handleOnChange({ target: { id: 'TaskRepeatFromWeekNum', value } })}
              value={inputs?.TaskRepeatFromWeekNum}
              options={weekOptions}
              className="w-32"
              placeholder="Week No."
              disabled={repeatInterval}
            />
          </div>
          <div className="flex ml-2">
            <Label className="!text-secondary pr-2" text="To" />
            <Select
              onChange={(value) => handleOnChange({ target: { id: 'TaskRepeatToWeekNum', value } })}
              value={inputs?.TaskRepeatToWeekNum}
              options={weekOptions}
              disabled={repeatInterval}
              placeholder="Week No."
              className="w-32"
            />
          </div>
        </div>
        <div className="flex">
          <Label className="!text-secondary pr-6 mr-4" text="Assigned to" />
          <Select
            onChange={(value) => handleOnChange({ target: { id: 'AssignedToUserId', value } })}
            value={inputs?.AssignedToUserId}
            options={usersList}
            placeholder="Select Assignee"
            className="w-64"
          />
        </div>
        <div>
          <Label className="!text-secondary pr-6 mr-4" text="Notes" />
          <TextArea onChange={handleOnChange} value={inputs?.Notes} className="w-full min-h-2" id="Notes" />
        </div>
        <div className="flex justify-between">
          <div />
          <div className="flex">
            <Label className="!text-secondary pr-2" text="Add to Master Task List" />
            <Checkbox
              id="occurence"
              value={inputs?.RepeatInterval}
              checked={isMasterTask}
              disabled={isMasterTask}
              onChange={(checked) => handleOnChange({ target: { id: 'CompleteByWeekNum', checked } })}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div />
          <div className="flex">
            <Button variant="secondary" onClick={onClose} className="mr-4 w-[132px]" text="Cancel" />
            <Button
              variant="primary"
              className="w-[132px]"
              onClick={handleOnSubmit}
              text={inputs.Id ? 'Edit Task' : 'Create New Task'}
            />
          </div>
        </div>
      </form>
    </PopupModal>
  );
};

export default AddTask;