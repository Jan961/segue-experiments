import React from 'react';
import { loggingService } from '../../../services/loggingService';
import { ProductionTaskDTO } from 'interfaces';
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect';
import { FormInputText } from 'components/global/forms/FormInputText';
import { StyledDialog } from 'components/global/StyledDialog';
import axios from 'axios';
import { productionState } from 'state/tasks/productionState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { weekOptions } from 'utils/weekOptions';
import { useRouter } from 'next/router';
import { Spinner } from 'components/global/Spinner';

interface NewTaskFormProps {
  task?: ProductionTaskDTO;
  triggerClose: () => void;
  open: boolean;
  recurring?: boolean;
}

const DEFAULT_TASK: ProductionTaskDTO = {
  Id: undefined,
  ProductionId: 0,
  Code: 0,
  Name: '',
  Interval: 'once',
  CompleteByPostProduction: false,
  StartByPostProduction: false,
  StartByWeekNum: -52,
  CompleteByWeekNum: -52,
  AssignedToUserId: 2,
  Progress: 0,
  Priority: 0,
};

const TaskEditor = ({ task, triggerClose, open, recurring = false }: NewTaskFormProps) => {
  const router = useRouter();
  const [alert, setAlert] = React.useState<string>('');
  const [inputs, setInputs] = React.useState<ProductionTaskDTO>(task || DEFAULT_TASK);
  const [status, setStatus] = React.useState({ submitted: true, submitting: false });
  const [productions, setProductions] = useRecoilState(productionState);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const users = useRecoilValue(userState).users;

  const creating = !inputs.Id;

  const handleOnChange = (e: any) => {
    let { id, value } = e.target;

    if (id === 'ProductionId') value = Number(value);
    if (id === 'Progress') value = Number(value);
    if (id === 'Priority') value = Number(value);
    if (id === 'StartByWeekNum') value = Number(value);
    if (id === 'CompleteByWeekNum') value = Number(value);
    if (id === 'AssignedToUserId') value = Number(value);

    const newInputs = { ...inputs, [id]: value };
    setInputs(newInputs);
    setStatus({ ...status, submitted: false });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (inputs.ProductionId === 0) {
      setAlert('Select a Production to add a task');
      return;
    }

    setIsLoading(true);
    if (inputs.Id) {
      try {
        await axios.post('/api/tasks/update', inputs);

        const updatedProductions = productions.map((production) => {
          if (production.Id === inputs.ProductionId) {
            const updatedTasks = production.Tasks.map((t) => (t.Id === inputs.Id ? inputs : t));
            return { ...production, Tasks: updatedTasks };
          }
          return production;
        });

        setProductions(updatedProductions);
        setIsLoading(false);
        triggerClose();
      } catch (error) {
        setIsLoading(false);
        loggingService.logError(error);
        console.error(error);
      }
    } else {
      try {
        const endpoint = recurring ? '/api/tasks/create/recurring' : '/api/tasks/create/single/';
        await axios.post(endpoint, inputs);
        setIsLoading(false);
        triggerClose();
        router.reload();
      } catch (error) {
        setIsLoading(false);
        loggingService.logError(error);
        console.error(error);
      }
    }
  };

  const productionOptions: SelectOption[] = [
    { text: '-- Select Production --', value: '' },
    ...productions.map((x) => ({ text: `${x.ShowName}/${x.Code}`, value: x.Id })),
  ];

  const progressOptions: SelectOption[] = [
    { text: 'Not Started', value: 0 },
    { text: '10%', value: 10 },
    { text: '25%', value: 25 },
    { text: '50%', value: 50 },
    { text: '75%', value: 75 },
    { text: '90%', value: 90 },
    { text: 'Completed', value: 100 },
  ];
  const statusOptions: SelectOption[] = [
    { text: 'To Do', value: 'todo' },
    { text: 'Doing', value: 'doing' },
    { text: 'Done', value: 'done' },
    { text: 'Blocked', value: 'blocked' },
  ];
  const priorityOptions: SelectOption[] = [
    { text: 'Low', value: 0 },
    { text: 'Medium', value: 1 },
    { text: 'High', value: 2 },
  ];

  return (
    <StyledDialog title={creating ? 'Create Task' : 'Edit Task'} open={open} onClose={triggerClose}>
      <form onSubmit={handleOnSubmit}>
        <p className="text-center text-red-500">{alert ?? ''}</p>
        <FormInputSelect
          name="ProductionId"
          label="Production"
          value={inputs.ProductionId}
          onChange={handleOnChange}
          options={productionOptions}
        />
        <FormInputText name="Name" label="Description" onChange={handleOnChange} value={inputs.Name} />
        <FormInputSelect
          name="StartByWeekNum"
          label="Start By (wk)"
          onChange={handleOnChange}
          value={inputs.StartByWeekNum}
          options={weekOptions}
        />
        <FormInputSelect
          name="CompleteByWeekNum"
          label="Due By (wk)"
          onChange={handleOnChange}
          value={inputs.CompleteByWeekNum}
          options={weekOptions}
        />
        <FormInputSelect
          name="AssignedToUserId"
          label="Assigned To"
          onChange={handleOnChange}
          value={inputs.AssignedToUserId}
          options={Object.values(users).map((user) => ({
            text: `${user.FirstName} ${user?.LastName ?? ''}`,
            value: user.Id,
          }))}
        />
        <FormInputSelect
          name="Progress"
          label="Progress"
          onChange={handleOnChange}
          value={inputs.Progress}
          options={progressOptions}
        />
        <FormInputSelect
          name="Status"
          label="Status"
          onChange={handleOnChange}
          value={inputs.Status}
          options={statusOptions}
        />
        <FormInputSelect
          name="Priority"
          label="Priority"
          onChange={handleOnChange}
          value={inputs.Priority}
          options={priorityOptions}
        />
        <FormInputText area name="Notes" label="Notes" onChange={handleOnChange} value={inputs.Notes} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={triggerClose} />
          {/* <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete> */}
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting || isLoading} submit>
            <div className="flex items-center gap-2">
              {isLoading && <Spinner size={'sm'} />}
              {creating ? 'Create' : 'Update'}
            </div>
          </StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  );
};

export default TaskEditor;
