import axios from 'axios';
import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';
import { FormInputText } from 'components/global/forms/FormInputText';
import React from 'react';

interface AvailableSeatsEditorProps {
  seatsAvailable: number;
  seatsAllocated: number;
  perfId: number;
  note: string;
  open: boolean;
  triggerClose: (refresh: boolean) => void;
}

export const AvailableSeatsEditor = ({
  seatsAvailable,
  seatsAllocated,
  note,
  open,
  triggerClose,
  perfId,
}: AvailableSeatsEditorProps) => {
  const [inputs, setInputs] = React.useState<any>({ Seats: seatsAvailable, Note: note, PerformanceId: perfId });
  const [status, setStatus] = React.useState({ submitting: false, submitted: true });

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault();
    setStatus({ ...status, submitting: true });

    try {
      await axios.post('/api/marketing/availableSeats/update', inputs);
      triggerClose(true);
    } catch {
      setStatus({ ...status, submitting: false });
    }
  };

  const handleSeatChange = async (value: number) => {
    setInputs({ ...inputs, Seats: value });

    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  const handleOnChange = async (e) => {
    e.persist();
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

  return (
    <StyledDialog title={'Set Available Seats'} open={open} onClose={() => triggerClose(false)}>
      <form onSubmit={handleOnSubmit}>
        <FormInputNumeric
          min={seatsAllocated}
          name="Seats"
          label="Seats Available"
          value={inputs.Seats}
          onChange={handleSeatChange}
        />
        <FormInputText area name="Note" label="Note" value={inputs.Note} onChange={handleOnChange} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={() => triggerClose(false)} />
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>
            Update
          </StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  );
};
