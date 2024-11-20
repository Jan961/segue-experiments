import { MasterTask } from 'prisma/generated/prisma-client';
import axios from 'axios';
import { ConfirmationDialog } from 'components/core-ui-lib';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateInput from 'components/core-ui-lib/DateInput';
import Label from 'components/core-ui-lib/Label';
import Loader from 'components/core-ui-lib/Loader';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { omit } from 'radash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { isNullOrEmpty } from 'utils';
import { getWeekOptions } from 'utils/taskDate';
import { priorityOptions, generatePercentageOptions } from 'utils/tasks';
import { productionJumpState } from 'state/booking/productionJumpState';
import { addOneMonthV2, formatDate, getDateDaysAway, newDate } from 'services/dateService';
import { RecurringTasksPopup } from './RecurringTasksPopup';
import { DeleteRecurringPopup } from './DeleteRecurringPopup';
import { useRouter } from 'next/router';
import { UTCDate } from '@date-fns/utc';

interface AddTaskProps {
  visible: boolean;
  isMasterTask?: boolean;
  onClose: () => void;
  task?: Partial<MasterTask> & { ProductionId?: number; ProductionTaskRepeat?: any; RepeatInterval?: string };
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
  Code: null,
  Name: '',
  Notes: '',
  TaskAssignedToAccUserId: null,
  Priority: 0,
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
      TaskRepeatFromWeekNum?: number;
      TaskRepeatToWeekNum?: number;
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

    if (isNullOrEmpty(task?.Id)) setIsRecurring(true);
    setIsRecurring(isNullOrEmpty(task?.RepeatInterval));
  }, [task]);

  const [status, setStatus] = useState({ submitted: true, submitting: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [isCloned, setIsCloned] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(true);
  const [showRecurringConfirmation, setShowRecurringConfirmation] = useState<boolean>(false);
  const [taskRecurringInfo, setTaskRecurringInfo] = useState(null);
  const [showRecurringDelete, setShowRecurringDelete] = useState<boolean>(false);
  const [showSingleDelete, setShowSingleDelete] = useState<boolean>(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
  const showOverlay = useMemo(() => {
    return showConfirmationDialog || showRecurringConfirmation || showRecurringDelete || showSingleDelete;
  }, [showConfirmationDialog, showRecurringConfirmation, showRecurringDelete, showSingleDelete]);
  const router = useRouter();
  const priorityOptionList = useMemo(
    () => priorityOptions.map((option) => ({ ...option, text: `${option.value} - ${option.text}` })),
    [],
  );
  const weekOptionsDate = useMemo(
    () => getWeekOptions(production, isMasterTask, !isMasterTask),
    [production, isMasterTask],
  );

  const weekOptionsNoDate = useMemo(
    () =>
      getWeekOptions(production, isMasterTask, false).filter((option) => {
        return parseInt(option.value.toString()) >= inputs?.StartByWeekNum;
      }),
    [production, isMasterTask, inputs?.StartByWeekNum],
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

  const { users } = useRecoilValue(userState);

  const usersList = useMemo(() => {
    if (isNullOrEmpty(users)) {
      return [];
    }

    const usersToReturn = Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));

    return usersToReturn;
  }, [users]);

  const handleOnChange = (e: any) => {
    if (taskRecurringInfo === null) {
      setTaskRecurringInfo(inputs);
    }

    let { id, value, checked } = e.target;
    if (
      [
        'TaskAssignedToAccUserId',
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
    if (id === 'StartByWeekNum') {
      const weekSelectArr = ['CompleteByWeekNum', 'TaskRepeatFromWeekNum', 'TaskRepeatToWeekNum'];
      for (const week in weekSelectArr) {
        if (inputs[week] < value) {
          inputs[week] = value;
        }
      }
    }

    if (id === 'RepeatInterval' && checked) {
      setIsRecurring(checked);
      value = 'once';
    }

    if (id === 'RepeatInterval' && isNullOrEmpty(inputs?.RepeatInterval)) {
      inputs.TaskRepeatFromWeekNum = inputs?.StartByWeekNum;
    }

    let newInputs = { ...inputs, [id]: value };
    if (id === 'Progress') {
      newInputs = {
        ...newInputs,
        TaskCompletedDate: value === 100 ? formatDate(newDate(), 'dd/MM/yy').toString() : null,
      };

      setInputs(newInputs);
    } else {
      setInputs(newInputs);
    }

    setStatus({ ...status, submitted: false });
  };

  const getNewTasksNum = (
    prodStartDate: UTCDate,
    taskRepeatFromWeekNum,
    taskRepeatToWeekNum,
    repeatInterval,
  ): number => {
    if (isNullOrEmpty(repeatInterval)) return 1;

    let taskStartDate = getDateDaysAway(prodStartDate, taskRepeatFromWeekNum * 7);
    const taskEndDate = getDateDaysAway(prodStartDate, taskRepeatToWeekNum * 7);

    const multiplier = repeatInterval === 'biweekly' ? 2 : 1;
    let counter = 0;

    while (taskStartDate <= taskEndDate) {
      counter++;
      taskStartDate =
        repeatInterval === 'monthly' ? addOneMonthV2(taskStartDate) : getDateDaysAway(taskStartDate, 7 * multiplier);
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
      newDate(production?.StartDate),
      previousTaskInfo?.TaskRepeatFromWeekNum,
      previousTaskInfo?.TaskRepeatToWeekNum,
      previousTaskInfo?.RepeatInterval,
    );

    const updatedTasks = getNewTasksNum(
      newDate(production?.StartDate),
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
        await router.replace(router.asPath);
      } catch (error) {
        setLoading(false);
      }
    } else {
      try {
        const endpoint = `/api/tasks/master/create/${inputs?.RepeatInterval ? 'recurring' : 'single'}/`;
        await axios.post(endpoint, inputs);
        setLoading(false);
        handleClose();
        await router.replace(router.asPath);
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
          await axios.post(`/api/tasks/update${inputs?.RepeatInterval ? '/recurring' : '/single'}`, inputs);
          setLoading(false);
          await router.replace(router.asPath);
          handleClose();
          await updateTableData(inputs, true);
        } catch (error) {
          setLoading(false);
        }
      } else {
        try {
          const endpoint = `/api/tasks/create/${inputs?.RepeatInterval ? 'recurring' : 'single'}/`;
          await axios.post(endpoint, inputs);
          if (isChecked) await handleMasterTask();
          setLoading(false);
          handleClose();
          await router.replace(router.asPath);

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
      await router.replace(router.asPath);
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
        await router.replace(router.asPath);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await axios.delete(`/api/tasks/delete/${inputs?.Id}`);
        setLoading(false);
        onClose();
        await updateTableData(inputs, false);
        await router.replace(router.asPath);
      } finally {
        setLoading(false);
      }
    }
    setShowSingleDelete(false);
  };

  const checkFieldsUpdated = () => {
    if (taskRecurringInfo === null) return false;
    for (const key in inputs) {
      if (taskRecurringInfo?.key || taskRecurringInfo[key] !== inputs[key]) {
        return true;
      }
    }
    return false;
  };

  const handleCancel = () => {
    if (checkFieldsUpdated()) {
      setShowConfirmationDialog(true);
    } else {
      handleClose();
    }
  };
  return (
    <PopupModal
      show={visible}
      onClose={handleCancel}
      hasOverlay={showOverlay}
      title={inputs.Id ? 'Edit Task' : 'Create New Task'}
    >
      <form className="flex flex-col gap-4 mt-2">
        {loading && <LoadingOverlay />}
        <div className="col-span-2 col-start-4 flex items-center justify-between">
          <Label className="!text-secondary pr-6 " text="Task Name" />
          <TextInput
            className="w-128 placeholder-secondary"
            placeholder="Enter Task Name"
            id="Name"
            onChange={handleOnChange}
            value={inputs?.Name}
            testId="txt-task-name"
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
            testId="txt-task-code"
          />
        </div>
        <div className="col-span-2 col-start-4 flex items-center">
          <div className="flex">
            <Label className="!text-secondary pr-6 mr-4" text="Start By" />
            <Select
              value={inputs?.StartByWeekNum}
              options={weekOptionsDate}
              placeholder="Week No."
              onChange={(value) => handleOnChange({ target: { id: 'StartByWeekNum', value } })}
              className="w-52"
              isSearchable={true}
              testId="sel-task-start-week"
            />
          </div>
          <div className="flex ml-10">
            <Label className="!text-secondary pr-6 " text="Complete By" />
            <Select
              onChange={(value) => handleOnChange({ target: { id: 'CompleteByWeekNum', value } })}
              value={inputs?.CompleteByWeekNum}
              options={weekOptionsDate.filter(
                (option) =>
                  parseInt(option.value.toString()) >= inputs?.StartByWeekNum || isNullOrEmpty(inputs?.StartByWeekNum),
              )}
              placeholder="Week No."
              className="w-52"
              isSearchable={true}
              testId="sel-task-complete-week"
              key={inputs?.StartByWeekNum}
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
              testId="sel-task-priority"
            />
          </div>
          <div className="flex ml-2">
            <Label className="!text-secondary pr-6" text="Progress" />
            <Select
              disabled={isMasterTask}
              onChange={(value) => handleOnChange({ target: { id: 'Progress', value } })}
              value={inputs?.Progress?.toString() || '0'}
              placeholder="Progress"
              isSearchable
              className="w-32"
              options={generatePercentageOptions}
              isClearable={false}
              testId="sel-task-progress"
            />
          </div>
          <div className="flex ml-2">
            <Label className="!text-secondary pr-6" text="Completed on" />
            <DateInput
              disabled={isMasterTask || !inputs.Progress || inputs.Progress < 100}
              value={inputs?.TaskCompletedDate}
              onChange={(value) => handleOnChange({ target: { id: 'TaskCompletedDate', value } })}
              testId="dat-task-complete-date"
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
              testId="chk-task-is-recurring"
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
                testId="sel-task-repeat-interval"
              />
            </div>
          )}
          {!isRecurring && inputs.RepeatInterval && (
            <div className="flex ml-2">
              <Label className="!text-secondary pr-2" text="From" />
              <Select
                onChange={(value) => handleOnChange({ target: { id: 'TaskRepeatFromWeekNum', value } })}
                value={inputs?.TaskRepeatFromWeekNum}
                options={weekOptionsNoDate}
                className="w-32"
                placeholder="Week No."
                isSearchable={true}
                testId="sel-task-repeat-from"
                key={inputs?.StartByWeekNum}
              />
            </div>
          )}
          {!isRecurring && inputs.RepeatInterval && (
            <div className="flex ml-2 gap-x-2">
              <Label className="!text-secondary" text="To" />
              <Select
                onChange={(value) => handleOnChange({ target: { id: 'TaskRepeatToWeekNum', value } })}
                value={inputs?.TaskRepeatToWeekNum}
                options={weekOptionsNoDate}
                placeholder="Week No."
                className="w-32"
                isSearchable={true}
                testId="sel-task-repeat-to"
                key={inputs?.StartByWeekNum}
              />
            </div>
          )}
        </div>
        <div className="flex">
          <Label className="!text-secondary pr-6 mr-4" text="Assigned to" />
          <Select
            onChange={(value) => handleOnChange({ target: { id: 'TaskAssignedToAccUserId', value } })}
            value={inputs?.TaskAssignedToAccUserId}
            options={usersList}
            placeholder="Select Assignee"
            className="w-64"
            testId="sel-task-assigned-to"
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
            testId="txt-task-notes"
          />
        </div>
        {!inputs.Id && (
          <div className="flex justify-between">
            <div />

            {!isMasterTask && (
              <div className="flex">
                <Label className="!text-secondary pr-2" text="Add to Master Task List" />
                <Checkbox
                  id="addToMasterTask"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  testId="chk-task-add-master"
                />
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <div />
          <div className="flex">
            <Button variant="secondary" onClick={handleCancel} className="mr-4 w-[132px]" text="Cancel" />
            {inputs.Id && (
              <>
                <Button
                  variant="tertiary"
                  onClick={handleDeletePress}
                  className="mr-4 w-[132px]"
                  text="Delete"
                  testId="btn-task-delete"
                />
                <Button
                  variant="primary"
                  onClick={handleClone}
                  className="mr-4 w-[132px]"
                  text="Clone this Task"
                  testId="btn-task-clone"
                  disabled={!isNullOrEmpty(inputs?.RepeatInterval)}
                />
              </>
            )}
            <Button
              variant="primary"
              className="w-[132px]"
              onClick={() => {
                return checkIfRecurringModal(isRecurring, taskRecurringInfo, inputs);
              }}
              text={inputs.Id ? 'Save' : 'Create New Task'}
              testId="btn-task-save"
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
      <ConfirmationDialog
        variant="cancel"
        show={showConfirmationDialog}
        onNoClick={() => {
          setShowConfirmationDialog(false);
        }}
        onYesClick={() => {
          setShowConfirmationDialog(false);
          handleClose();
        }}
      />
    </PopupModal>
  );
};

export default AddTask;
