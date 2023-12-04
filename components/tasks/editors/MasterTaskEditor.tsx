import { MasterTask } from '@prisma/client';
import React, { useEffect, useMemo } from 'react';
import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputDate } from 'components/global/forms/FormInputDate';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect';
import { FormInputText } from 'components/global/forms/FormInputText';
import { loggingService } from 'services/loggingService';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';

interface NewTaskFormProps {
    task?: MasterTask;
    triggerClose: () => void;
    open: boolean;
}

const DEFAULT_MASTER_TASK: MasterTask = {
    Id: undefined,
    Code: 0,
    Name: '',
    Notes: '',
    AssignedToUserId: null,
    Priority: 0,
    AccountId: 0,
    RepeatInterval: '',
    RepeatCount: null,
    StartByWeekNum: 0,
    StartByIsPostTour: false,
    CompleteByWeekNum: 0,
    CompleteByIsPostTour: false
};

const MasterTaskEditor = ({ task, triggerClose, open }:NewTaskFormProps) => {
  const {users={}} = useRecoilValue(userState);
  const [alert, setAlert] = React.useState<string>('');
  const [inputs, setInputs] = React.useState<MasterTask>(task || DEFAULT_MASTER_TASK);
  const [status, setStatus] = React.useState({ submitted: true, submitting: false });
  const userOptions = useMemo(()=>Object.values(users).map(user=>({text:`${user.FirstName} ${user.LastName} (${user.Email})`, value:user?.Id})),[users])
  const creating = !inputs.Id;
  const handleCodeChange = (code: number) => {
    setInputs({ ...inputs, Code: code });
  };
  const handleOnChange = (e: any) => {
    let { id, value } = e.target;
    if(id==='AssignedToUserId')value = parseInt(value,10)
    const newInputs = { ...inputs, [id]: value };
    setInputs(newInputs);
    setStatus({ ...status, submitted: false });
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (inputs.Id) {
      try {
        await axios.post('/api/tasks/master/update', inputs);
        triggerClose();
      } catch (error) {
        loggingService.logError(error);
        console.error(error);
      }
    } else {
      try {
        const endpoint = '/api/tasks/master/create';
        await axios.post(endpoint, inputs);
        triggerClose();
      } catch (error) {
        loggingService.logError(error);
        console.error(error);
      }
    }
  };
  return (
    <StyledDialog title={creating ? 'Create Master Task' : 'Edit Master Task'} open={open} onClose={triggerClose}>
      <form onSubmit={handleOnSubmit}>
        <p className="text-center text-red-500">{alert ?? ''}</p>
        <FormInputNumeric name="Code" label="Code" value={inputs.Code} onChange={handleCodeChange} />
        <FormInputText name="Name" label="Name" onChange={handleOnChange} value={inputs.Name} />
        <FormInputSelect name="AssignedToUserId" label="Assigned To" onChange={handleOnChange} value={inputs.AssignedToUserId} options={userOptions} />
        <FormInputNumeric name="StartByWeekNum" label="Start by" onChange={(change)=>handleOnChange({target:{id:'StartByWeekNum', value:change}})} value={inputs.StartByWeekNum} />
        <FormInputNumeric name="CompleteByWeekNum" label="Complete by" onChange={(change)=>handleOnChange({target:{id:'CompleteByWeekNum', value:change}})} value={inputs.CompleteByWeekNum} />
        <FormInputText area name="Notes" label="Notes" onChange={handleOnChange} value={inputs.Notes} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={triggerClose} />
          {/* <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete> */}
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>
            {creating ? 'Create' : 'Update'}
          </StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  );
};

export default MasterTaskEditor
