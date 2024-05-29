import { MasterTask } from '@prisma/client';
import React, { useMemo } from 'react';
import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { FormInputText } from 'components/global/forms/FormInputText';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { weekOptions } from 'utils/getTaskDateStatus';
import { Spinner } from 'components/global/Spinner';
import { priorityOptions } from 'utils/tasks';

interface NewTaskFormProps {
  task?: Partial<MasterTask>;
  triggerClose: () => void;
  open: boolean;
}

const DEFAULT_MASTER_TASK: Partial<MasterTask> = {
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
};

const MasterTaskEditor = ({ task, triggerClose, open }: NewTaskFormProps) => {
  const { users = {} } = useRecoilValue(userState);
  const [alert, setAlert] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [inputs, setInputs] = React.useState<Partial<MasterTask>>(task || DEFAULT_MASTER_TASK);
  const [status, setStatus] = React.useState({ submitted: true, submitting: false });
  const priorityOptionList = React.useMemo(
    () => priorityOptions.map((option) => ({ ...option, text: `${option.value} - ${option.text}` })),
    [],
  );
  const userOptions = useMemo(
    () =>
      Object.values(users).map((user) => ({
        text: `${user.FirstName} ${user.LastName} (${user.Email})`,
        value: user?.Id,
      })),
    [users],
  );
  const creating = !inputs.Id;
  // const handleCodeChange = (code: number) => {
  //   setInputs({ ...inputs, Code: code });
  // };
  const handleOnChange = (e: any) => {
    let { id, value } = e.target;
    if (['AssignedToUserId', 'StartByWeekNum', 'CompleteByWeekNum', 'Priority'].includes(id))
      value = parseInt(value, 10);
    const newInputs = { ...inputs, [id]: value };
    setInputs(newInputs);
    setStatus({ ...status, submitted: false });
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // try {
    //   if (inputs.Id) {
    //     await axios.post('/api/tasks/master/update', inputs);
    //     const updatedTasks = masterTasks.map((masterTask) => {
    //       if (masterTask.Id === task.Id) {
    //         return { ...task, ...inputs };
    //       }
    //       return masterTask;
    //     });
    //     setMasterTasks(updatedTasks);
    //   } else {
    //     const endpoint = '/api/tasks/master/create';
    //     const {
    //       data: { Code, Id },
    //     } = (await axios.post(endpoint, inputs)) || { data: {} };
    //     const updatedTasks = [{ ...inputs, Id, Code }, ...masterTasks];
    //     setMasterTasks(updatedTasks);
    //   }
    // } catch (error) {
    //   loggingService.logError(error);
    //   console.error(error);
    setAlert('Error updating the task');
    // }
    // setLoading(false);
    // triggerClose();
  };
  return (
    <StyledDialog title={creating ? 'Create Master Task' : 'Edit Master Task'} open={open} onClose={triggerClose}>
      {loading && (
        <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
          <Spinner className="w-full" size="lg" />
        </div>
      )}
      <form onSubmit={handleOnSubmit}>
        <p className="text-center text-red-500">{alert ?? ''}</p>
        {/* <FormInputNumeric name="Code" label="Code" value={inputs.Code} onChange={handleCodeChange} /> */}
        <FormInputText name="Name" label="Name" onChange={handleOnChange} value={inputs.Name} />
        <FormInputSelect
          name="AssignedToUserId"
          label="Assigned To"
          onChange={handleOnChange}
          value={inputs.AssignedToUserId}
          options={userOptions}
        />
        <FormInputSelect
          name="Priority"
          label="Priority"
          onChange={handleOnChange}
          value={inputs.Priority}
          options={priorityOptionList}
        />
        <FormInputSelect
          name="StartByWeekNum"
          label="Start by"
          onChange={handleOnChange}
          value={inputs.StartByWeekNum}
          options={weekOptions}
        />
        <FormInputSelect
          name="CompleteByWeekNum"
          label="Complete by"
          onChange={handleOnChange}
          value={inputs.CompleteByWeekNum}
          options={weekOptions}
        />
        <FormInputText area name="Notes" label="Notes" onChange={handleOnChange} value={inputs.Notes} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={triggerClose} />
          {/* <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete> */}
          <StyledDialog.FooterContinue
            className="bg-purple-900"
            disabled={status.submitted || status.submitting}
            submit
          >
            {creating ? 'Create' : 'Update'}
          </StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  );
};

export default MasterTaskEditor;
