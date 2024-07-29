import { MasterTask } from '@prisma/client';
import axios from 'axios';
import { ConfirmationDialog } from 'components/core-ui-lib';
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
import moment from 'moment';
import { omit } from 'radash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { isNullOrEmpty } from 'utils';
import { getWeekOptions } from 'utils/getTaskDateStatus';
import { priorityOptions } from 'utils/tasks';
import { productionJumpState } from 'state/booking/productionJumpState';
import { addDurationToDate, addOneMonth } from 'services/dateService';
import { RecurringTasksPopup } from './RecurringTasksPopup';
import { DeleteRecurringPopup } from './DeleteRecurringPopup';

interface AddTaskProps {
  visible: boolean;
  isMasterTask?: boolean;
  onClose: () => void;
  task?: Partial<MasterTask> & { ProductionId?: number; ProductionTaskRepeat?: any };
  productionId?: number;
  updateTableData: (task: any, isAdding: boolean) => Promise<void>;
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

const DEFAULT_MASTER_TASK: Partial<MasterTask> & {
  Progress?: number;
  DueDate?: string;
  ProductionId?: number;
  CompleteDate?: string;
  TaskCompletedDate?: string;
} = {
  Id: undefined,
  Code: 0,
  Name: '',
  Notes: '',
  AssignedToUserId: null,
  Priority: 0,
  AccountId: 0,
  StartByWeekNum: 0,
  TaskStartByIsPostProduction: false,
  CompleteByWeekNum: 0,
  TaskCompleteByIsPostProduction: false,
  Progress: 0,
  DueDate: '',
  ProductionId: 0,
  TaskCompletedDate: '',
};

const AddTask = ({
  visible,
  onClose,
  task,
  isMasterTask = false,
  productionId = null,
  updateTableData,
}: AddTaskProps) => {
  const [inputs, setInputs] = useState<
    Partial<MasterTask> & {
      Progress?: number;
      DueDate?: string;
      ProductionId?: number;
      TaskCompletedDate?: string;
      RepeatInterval?: string;
      TaskRepeatFromWeekNum?: string;
      TaskRepeatToWeekNum?: string;
      ProductionTaskRepeat?: any;
      PRTId?: number;
    }
  >(
    task ||
      DEFAULT_MASTER_TASK || {
        ProductionTaskRepeat: task?.ProductionTaskRepeat.Interval,
        TaskRepeatFromWeekNum: task?.ProductionTaskRepeat?.FromWeekNum,
        TaskRepeatToWeekNum: task?.ProductionTaskRepeat?.ToWeekNum,
        PRTId: task?.ProductionTaskRepeat?.PRTId,
      },
  );
  inputs.RepeatInterval = inputs?.RepeatInterval || inputs.ProductionTaskRepeat?.Interval;
  inputs.TaskRepeatFromWeekNum = inputs?.TaskRepeatFromWeekNum || inputs.ProductionTaskRepeat?.FromWeekNum;
  inputs.TaskRepeatToWeekNum = inputs?.TaskRepeatToWeekNum || inputs.ProductionTaskRepeat?.ToWeekNum;
  const productionList = useRecoilValue(productionJumpState).productions;
  const production =
    useRecoilValue(currentProductionSelector) || productionList.find((item) => item.Id === productionId);
  useEffect(() => {
    setInputs(task);
  }, [task]);

  const [status, setStatus] = useState({ submitted: true, submitting: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [isCloned, setIsCloned] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [showRecurringConfirmation, setShowRecurringConfirmation] = useState<boolean>(false);
  const [taskRecurringInfo, setTaskRecurringInfo] = useState(null);
  const [showRecurringDelete, setShowRecurringDelete] = useState<boolean>(false);
  const [showSingleDelete, setShowSingleDelete] = useState<boolean>(false);
  const priorityOptionList = useMemo(
    () => priorityOptions.map((option) => ({ ...option, text: `${option.value} - ${option.text}` })),
    [],
  );
  const showCode = useMemo(() => {
    return inputs?.Id ? `${production?.ShowCode}${production?.Code}-${inputs.Code}` : null;
  }, [inputs?.Id, production?.ShowCode, production?.Code, inputs.Code]);

  useEffect(() => {
    if (isCloned) {
      const updatedInputs = { ...inputs };
      delete updatedInputs.Id;
      setInputs(updatedInputs);
    }
  }, [isCloned]);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputs.Notes]);

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
    if (taskRecurringInfo === null) {
      setTaskRecurringInfo(inputs);
    }

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

    if (checked != null) {
      setIsRecurring(checked);
    }

    if (id === 'RepeatInterval' && checked) {
      setIsRecurring(checked);
      value = 'once';
    }

    let newInputs = { ...inputs, [id]: value };
    if (id === 'Progress' && value === 100) {
      newInputs = { ...newInputs, TaskCompletedDate: moment.utc(new Date(), 'DD/MM/YY').toString() };
      setInputs(newInputs);
    } else {
      setInputs(newInputs);
    }

    setStatus({ ...status, submitted: false });
  };

  const getNewTasksNum = (prodStartDate: Date, taskRepeatFromWeekNum, taskRepeatToWeekNum, repeatInterval): number => {
    let taskStartDate = addDurationToDate(prodStartDate, taskRepeatFromWeekNum * 7, true);
    const taskEndDate = addDurationToDate(prodStartDate, taskRepeatToWeekNum * 7, true);

    const multiplier = repeatInterval === 'biweekly' ? 2 : 1;
    let counter = 0;

    while (taskStartDate <= taskEndDate) {
      counter++;
      taskStartDate =
        repeatInterval === 'monthly'
          ? addOneMonth(taskStartDate)
          : addDurationToDate(taskStartDate, 7 * multiplier, true);
    }

    return counter;
  };

  const checkIfRecurringModal = async (isRecurring: boolean, previousInfo, newInfo) => {
    if (isMasterTask) {
      await handleOnSubmit();
      onClose();
      setInputs(DEFAULT_MASTER_TASK);
      await updateTableData(newInfo, true);
      return;
    } else {
      if (previousInfo === null) {
        await handleOnSubmit();
        onClose();
        await updateTableData(newInfo, true);
        setInputs(DEFAULT_MASTER_TASK);

        return;
      }
    }

    const fieldsToCheck = ['TaskRepeatToWeekNum', 'TaskRepeatFromWeekNum', 'RepeatInterval'];
    let differenceInObj = false;
    fieldsToCheck.forEach((field) => {
      if (newInfo[field] !== previousInfo[field]) {
        differenceInObj = true;
      }
    });

    if (!differenceInObj) {
      await handleOnSubmit();
      onClose();
    } else if (previousInfo?.Name === undefined) {
      await handleOnSubmit();
      onClose();
    } else {
      setShowRecurringConfirmation(true);
    }
  };

  const getNumTaskDifference = (previousTaskInfo, updatedTaskInfo, production) => {
    if (previousTaskInfo?.Name === null) {
      setShowRecurringConfirmation(false);
      handleOnSubmit();
    }

    const previousTasks = getNewTasksNum(
      new Date(production?.StartDate),
      previousTaskInfo?.TaskRepeatFromWeekNum,
      previousTaskInfo?.TaskRepeatToWeekNum,
      previousTaskInfo?.RepeatInterval,
    );

    const updatedTasks = getNewTasksNum(
      new Date(production?.StartDate),
      updatedTaskInfo?.TaskRepeatFromWeekNum,
      updatedTaskInfo?.TaskRepeatToWeekNum,
      updatedTaskInfo?.RepeatInterval,
    );
    return updatedTasks - previousTasks;
  };

  const handleMasterTask = async () => {
    omit(inputs, ['TaskCompleteByIsPostProduction', 'TaskStartByIsPostProduction', 'ProductionTaskRepeat']);
    if (inputs.Id) {
      try {
        await axios.post(`/api/tasks/master/update/${inputs?.RepeatInterval ? 'recurring' : 'single'}`, inputs);
        setLoading(false);
        handleClose();
      } catch (error) {
        setLoading(false);
      }
    } else {
      try {
        const endpoint = `/api/tasks/master/create/${inputs?.RepeatInterval ? 'recurring' : 'single'}/`;
        await axios.post(endpoint, inputs);
        setLoading(false);
        if (isChecked) {
          await handleMasterTask();
        }
        onClose();
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  const handleOnSubmit = async () => {
    setLoading(false);
    if (isMasterTask) {
      await handleMasterTask();
      await updateTableData(inputs, true);
    } else {
      omit(inputs, ['TaskCompleteByIsPostProduction', 'TaskStartByIsPostProduction', 'ProductionTaskRepeat']);
      if (inputs.Id) {
        try {
          await axios.post(`/api/tasks/update${inputs?.RepeatInterval ? '/recurring' : ''}`, inputs);
          setLoading(false);
          handleClose();
          await updateTableData(inputs, true);
        } catch (error) {
          setLoading(false);
        }
      } else {
        try {
          const endpoint = `/api/tasks/create/${inputs?.RepeatInterval ? 'recurring' : 'single'}/`;
          await axios.post(endpoint, inputs);
          setLoading(false);
          if (isChecked) {
            await handleMasterTask();
          }
          onClose();
          await updateTableData(inputs, true);
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      }
    }
  };

  const handleClose = () => {
    onClose();
    setLoading(false);
    setInputs(DEFAULT_MASTER_TASK);
    setIsCloned(false);
  };

  const handleClone = () => {
    setIsCloned(true);
  };

  const handleDeletePress = () => {
    if (isMasterTask) {
      setShowSingleDelete(true);
    } else {
      if (!isNullOrEmpty(inputs?.PRTId)) {
        setShowRecurringDelete(true);
      } else {
        setShowSingleDelete(true);
      }
    }
  };

  const handleRecurringDelete = async (selectOption) => {
    try {
      await axios.post(`/api/tasks/delete/recurring`, {
        selectOption,
        taskId: inputs.Id,
        PRTId: inputs.PRTId,
        weekStart: inputs.StartByWeekNum,
      });
      setLoading(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSingleDelete = async () => {
    setLoading(true);
    if (isMasterTask) {
      try {
        await axios.delete(`/api/tasks/master/delete/${inputs?.Id}`);
        setLoading(false);
        onClose();
        await updateTableData(inputs, false);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await axios.delete(`/api/tasks/delete/${inputs?.Id}`);
        setLoading(false);
        onClose();
        await updateTableData(inputs, false);
      } finally {
        setLoading(false);
      }
    }
    setShowSingleDelete(false);
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
            disabled
            className="w-128 placeholder-secondary"
            placeholder="Code is assigned when task is created"
            onChange={handleOnChange}
            value={isMasterTask ? inputs?.Code?.toString() : showCode}
          />
        </div>
        <div className="col-span-2 col-start-4 flex items-center">
          <div className="flex">
            <Label className="!text-secondary pr-6 mr-4" text="Start By" />
            <Select
              value={inputs?.StartByWeekNum}
              options={getWeekOptions(production, isMasterTask, !isMasterTask)}
              placeholder="Week No."
              onChange={(value) => handleOnChange({ target: { id: 'StartByWeekNum', value } })}
              className="w-52"
              isSearchable={true}
            />
          </div>
          <div className="flex ml-10">
            <Label className="!text-secondary pr-6 " text="Complete By" />
            <Select
              onChange={(value) => handleOnChange({ target: { id: 'CompleteByWeekNum', value } })}
              value={inputs?.CompleteByWeekNum}
              options={getWeekOptions(production, isMasterTask, !isMasterTask)}
              placeholder="Week No."
              className="w-52"
              isSearchable={true}
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
              value={inputs?.Progress?.toString()}
              placeholder="Progress"
              isSearchable
              className="w-32"
              options={generatePercentageOptions}
            />
          </div>
          <div className="flex ml-2">
            <Label className="!text-secondary pr-6" text="Completed on" />
            <DateInput
              disabled={isMasterTask || !inputs.Progress || inputs.Progress < 100}
              value={inputs?.TaskCompletedDate}
              onChange={(value) => handleOnChange({ target: { id: 'TaskCompletedDate', value } })}
            />
          </div>
        </div>
        <h3 className="font-bold text-xl mt-4">Occurrence</h3>
        <div className="col-span-2 col-start-4 flex items-center">
          <div className="flex">
            <Label className="!text-secondary pr-2" text="Only Once" />
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onChange={(event) => handleOnChange({ target: { id: 'isRecurring', checked: event.target.checked } })}
            />
          </div>
          {!isRecurring && (
            <div className="flex">
              <Label className="!text-secondary px-2" text="Repeat" />
              <Select
                onChange={(value) => handleOnChange({ target: { id: 'RepeatInterval', value } })}
                value={inputs?.RepeatInterval}
                className="w-44"
                options={RepeatOptions}
                placeholder="Select..."
              />
            </div>
          )}
          {!isRecurring && (
            <div className="flex ml-2">
              <Label className="!text-secondary pr-2" text="From" />
              <Select
                onChange={(value) => handleOnChange({ target: { id: 'TaskRepeatFromWeekNum', value } })}
                value={inputs?.TaskRepeatFromWeekNum}
                options={getWeekOptions(production, isMasterTask, false)}
                className="w-32"
                placeholder="Week No."
                isSearchable={true}
              />
            </div>
          )}
          {!isRecurring && (
            <div className="flex ml-2">
              <Label className="!text-secondary" text="To" />
              <Select
                onChange={(value) => handleOnChange({ target: { id: 'TaskRepeatToWeekNum', value } })}
                value={inputs?.TaskRepeatToWeekNum}
                options={getWeekOptions(production, isMasterTask, false)}
                placeholder="Week No."
                className="w-32"
                isSearchable={true}
              />
            </div>
          )}
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
          <TextArea
            ref={textareaRef}
            onChange={handleOnChange}
            value={inputs?.Notes}
            className="w-full min-h-14"
            id="Notes"
          />
        </div>
        {!inputs.Id && (
          <div className="flex justify-between">
            <div />

            {!isMasterTask && (
              <div className="flex">
                <Label className="!text-secondary pr-2" text="Add to Master Task List" />
                <Checkbox id="addToMasterTask" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <div />
          <div className="flex">
            <Button variant="secondary" onClick={onClose} className="mr-4 w-[132px]" text="Cancel" />
            {inputs.Id && (
              <>
                <Button variant="tertiary" onClick={handleDeletePress} className="mr-4 w-[132px]" text="Delete" />
                <Button variant="primary" onClick={handleClone} className="mr-4 w-[132px]" text="Clone this Task" />
              </>
            )}
            <Button
              variant="primary"
              className="w-[132px]"
              onClick={() => {
                return checkIfRecurringModal(isRecurring, taskRecurringInfo, inputs);
              }}
              text={inputs.Id ? 'Save' : 'Create New Task'}
            />
          </div>
        </div>
        {showRecurringConfirmation && (
          <RecurringTasksPopup
            visible={showRecurringConfirmation}
            onClose={() => {
              setShowRecurringConfirmation(false);
            }}
            numTaskChange={getNumTaskDifference(taskRecurringInfo, inputs, production)}
            onSubmit={() => {
              handleOnSubmit();
            }}
            isNewTask={inputs?.Id === undefined}
          />
        )}
      </form>

      <DeleteRecurringPopup
        visible={showRecurringDelete}
        onClose={() => {
          setShowRecurringDelete(false);
        }}
        onSubmit={handleRecurringDelete}
      />

      <ConfirmationDialog
        variant="delete"
        show={showSingleDelete}
        onYesClick={handleSingleDelete}
        onNoClick={() => setShowSingleDelete(false)}
        hasOverlay={false}
      />
    </PopupModal>
  );
};

export default AddTask;
