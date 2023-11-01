import axios from 'axios';
import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { FormInputDate } from 'components/global/forms/FormInputDate';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { FormInputText } from 'components/global/forms/FormInputText';
import { ActivityDTO } from 'interfaces';
import React from 'react';

interface ActivitiesEditorProps {
  activity?: ActivityDTO;
  open: boolean;
  triggerClose: (refresh: boolean) => void;
  types: { Id: number; Name: string }[];
}

export const ActivitiesEditor = ({ activity, open, triggerClose, types }: ActivitiesEditorProps) => {
  const [inputs, setInputs] = React.useState<Partial<ActivityDTO>>({ ...activity });
  const [status, setStatus] = React.useState({ submitting: false, submitted: true });

  const creating = !inputs.Id;

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault();
    setStatus({ ...status, submitting: true });

    const CompanyCost = Number(inputs.CompanyCost);
    const VenueCost = Number(inputs.VenueCost);

    if (isNaN(VenueCost) || isNaN(CompanyCost)) {
      alert('Costs must be a valid number');
      return;
    }

    if (creating) {
      try {
        await axios.post('/api/marketing/activities/create', { CompanyCost, VenueCost, ...inputs });
        triggerClose(true);
      } catch {
        setStatus({ ...status, submitting: false });
      }
    } else {
      try {
        await axios.post('/api/marketing/activities/update', { CompanyCost, VenueCost, ...inputs });
        triggerClose(true);
      } catch {
        setStatus({ ...status, submitting: false });
      }
    }
  };

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true });
    try {
      await axios.post('/api/marketing/activities/delete', inputs);
      triggerClose(true);
    } catch {
      setStatus({ ...status, submitting: false });
    }
  };

  const handleOnChange = async (e) => {
    const { id, value } = e.target;

    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));

    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  // Has to be a number
  const changeActivityType = (e) => {
    const ActivityTypeId = Number(e.target.value);

    setInputs({ ...inputs, ActivityTypeId });

    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  const handleCompanyCostChange = (value: number) => {
    setInputs({ ...inputs, CompanyCost: value });

    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  const handleVenueCostChange = (value: number) => {
    setInputs({ ...inputs, VenueCost: value });

    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  const options = [
    { text: '-- Select Type --', value: '' },
    ...types.map((x) => ({ text: x.Name, value: x.Id.toString() })),
  ];

  return (
    <StyledDialog
      title={creating ? 'Create Allocated Seat' : 'Edit Allocated Seat'}
      open={open}
      onClose={() => triggerClose(false)}
    >
      <form onSubmit={handleOnSubmit}>
        <FormInputText name="Name" label="Name" value={inputs.Name} onChange={handleOnChange} />
        <FormInputSelect
          required
          name="ActivityTypeId"
          value={inputs.ActivityTypeId}
          label="Type"
          options={options}
          onChange={changeActivityType}
        />
        <FormInputDate name="Date" value={inputs.Date} label="Date" onChange={handleOnChange} />
        <FormInputCheckbox
          name="FollowUpRequired"
          value={inputs.FollowUpRequired}
          label="Follow Up Req"
          onChange={handleOnChange}
        />
        <FormInputNumeric
          name="CompanyCost"
          label="Company Cost"
          value={inputs.CompanyCost}
          onChange={handleCompanyCostChange}
        />
        <FormInputNumeric
          name="VenueCost"
          label="Venue Cost"
          value={inputs.VenueCost}
          onChange={handleVenueCostChange}
        />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={() => triggerClose(false)} />
          <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>
            Delete
          </StyledDialog.FooterDelete>
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>
            {creating ? 'Create' : 'Update'}
          </StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  );
};
