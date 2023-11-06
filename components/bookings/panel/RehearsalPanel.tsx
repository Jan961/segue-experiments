import axios from 'axios';
import { DeleteConfirmation } from 'components/global/DeleteConfirmation';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect';
import { FormInputText } from 'components/global/forms/FormInputText';
import { RehearsalDTO } from 'interfaces';
import { omit } from 'radash';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { rehearsalState } from 'state/booking/rehearsalState';
import { sortedRehearsalSelector } from 'state/booking/selectors/sortedRehearsalSelector';
import { viewState } from 'state/booking/viewState';
import { getNextId } from './utils/getNextId';

interface RehearsalPanelProps {
  rehearsalId: number;
}

export const RehearsalPanel = ({ rehearsalId }: RehearsalPanelProps) => {
  const [deleting, setDeleting] = React.useState(false);
  const [{ submitting, changed }, setStatus] = React.useState({ submitting: false, changed: false });
  const setView = useSetRecoilState(viewState);
  const [rehearsalDict, setRehearsalDict] = useRecoilState(rehearsalState);
  const rehearsal = rehearsalDict[rehearsalId];
  const [inputs, setInputs] = React.useState<RehearsalDTO>(rehearsal);
  const sorted = useRecoilValue(sortedRehearsalSelector);

  const nextRehearsalId = getNextId(sorted, rehearsalId);

  const handleOnChange = (e: any) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({ changed: true, submitting: false });
  };

  const save = async (e: any) => {
    // Swap around the dates
    e.preventDefault();
    setStatus({ changed: true, submitting: true });
    try {
      const { data } = await axios.post('/api/rehearsals/update', inputs);
      const replacement = { ...rehearsalDict, [data.Id]: data };
      setRehearsalDict(replacement);
      setStatus({ changed: false, submitting: false });
    } catch {
      setStatus({ changed: true, submitting: false });
    }
  };

  const saveAndNext = async (e: any) => {
    e.preventDefault();
    if (changed) await save(e);
    const nextRehearsal = rehearsalDict[nextRehearsalId];
    setView({ selectedDate: nextRehearsal.Date.split('T')[0], selected: { type: 'rehearsal', id: nextRehearsalId } });
  };

  const statusOptions: SelectOption[] = [
    { text: 'Confirmed (C)', value: 'C' },
    { text: 'Unconfirmed (U)', value: 'U' },
    { text: 'Cancelled (X)', value: 'X' },
  ];

  const initiateDelete = async () => {
    setDeleting(true);
  };

  const performDelete = async () => {
    setDeleting(false);
    await axios.post('/api/rehearsals/delete', { ...rehearsal });
    const newState = omit(rehearsalDict, [rehearsalId]);
    setView({ selectedDate: undefined, selected: undefined });
    setRehearsalDict(newState);
  };

  return (
    <>
      {deleting && (
        <DeleteConfirmation title="Delete Performance" onCancel={() => setDeleting(false)} onConfirm={performDelete}>
          <p>This will delete the performance permanently</p>
        </DeleteConfirmation>
      )}
      <FormInputText value={inputs.Town ? inputs.Town : ''} name="Town" label="Town" onChange={handleOnChange} />
      <FormInputSelect
        inline
        value={inputs.StatusCode}
        onChange={handleOnChange}
        options={statusOptions}
        name="StatusCode"
        label="Status"
      />
      <div className="grid grid-cols-3 gap-2 py-4 pb-0">
        <div>
          <FormInputButton
            className="w-full"
            text="Delete"
            intent="DANGER"
            onClick={initiateDelete}
            disabled={submitting}
          />
        </div>
        <div className="col-span-2 grid grid-cols-2">
          <FormInputButton
            className="rounded-br-none rounded-tr-none w-full border-r border-soft-primary-blue"
            text="Save"
            intent="PRIMARY"
            disabled={submitting || !changed}
            onClick={save}
          />
          <FormInputButton
            className="rounded-bl-none rounded-tl-none w-full"
            text={!changed ? 'Next' : 'Save & Next'}
            intent="PRIMARY"
            onClick={saveAndNext}
            disabled={submitting || !nextRehearsalId}
          />
        </div>
      </div>
    </>
  );
};
