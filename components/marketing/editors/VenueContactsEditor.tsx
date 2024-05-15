import axios from 'axios';
import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { FormInputText } from 'components/global/forms/FormInputText';
import { VenueContactDTO } from 'interfaces';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { venueRoleState } from 'state/marketing/venueRoleState';

interface VenueContactsEditorProps {
  venueContact?: VenueContactDTO;
  open: boolean;
  venueId: number;
  triggerClose: (refresh: boolean) => void;
}

export const VenueContactsEditor = ({ venueContact, open, triggerClose, venueId }: VenueContactsEditorProps) => {
  const [inputs, setInputs] = React.useState<Partial<VenueContactDTO>>(venueContact || { VenueId: venueId });
  const [status, setStatus] = React.useState({ submitting: false, submitted: true });
  const venueRoles = useRecoilValue(venueRoleState);

  const creating = !inputs.Id;

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault();
    setStatus({ ...status, submitting: true });

    if (creating) {
      try {
        await axios.post('/api/marketing/venueContacts/create', inputs);
        triggerClose(true);
      } catch {
        setStatus({ ...status, submitting: false });
      }
    } else {
      try {
        await axios.post('/api/marketing/venueContacts/update', inputs);
        triggerClose(true);
      } catch {
        setStatus({ ...status, submitting: false });
      }
    }
  };

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true });
    try {
      await axios.post('/api/marketing/venueContacts/delete', inputs);
      triggerClose(true);
    } catch {
      setStatus({ ...status, submitting: false });
    }
  };

  const handleOnChange = async (e) => {
    e.persist();
    let { id, value } = e.target;

    if (id === 'RoleId') value = parseInt(value);

    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));

    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  const roleList = [
    { text: '-- Select Role --', value: undefined },
    ...venueRoles.map((vr) => ({ text: vr.Name, value: vr.Id.toString() })),
  ];

  return (
    <StyledDialog
      title={creating ? 'Create Venue Contact' : 'Edit Venue Contact'}
      open={open}
      onClose={() => triggerClose(false)}
    >
      <form onSubmit={handleOnSubmit}>
        <FormInputText name="FirstName" label="First Name" value={inputs.FirstName} onChange={handleOnChange} />
        <FormInputText name="LastName" label="Last Name" value={inputs.LastName} onChange={handleOnChange} />
        <FormInputText name="Email" label="Email" value={inputs.Email} onChange={handleOnChange} />
        <FormInputText name="Phone" label="Phone" value={inputs.Phone} onChange={handleOnChange} />
        <FormInputSelect
          name="RoleId"
          label="Role"
          value={inputs.VenueRoleId}
          onChange={handleOnChange}
          options={roleList}
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
