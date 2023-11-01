import React from 'react';
import { DateTimeSelector } from './components/DateTimeSelector';
import { useRecoilState, useRecoilValue } from 'recoil';
import { viewState } from 'state/booking/viewState';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { PerformanceDTO } from 'interfaces';
import axios from 'axios';
import { performanceState } from 'state/booking/performanceState';

interface CreatePerformancePanelProps {
  reset: () => void;
  bookingId: number;
}

export const CreatePerformancePanel = ({ reset, bookingId }: CreatePerformancePanelProps) => {
  const { selectedDate } = useRecoilValue(viewState);
  const [date, setDate] = React.useState(selectedDate + 'T18:30:00');
  const [submitting, setSubmitting] = React.useState(false);
  const [perfDict, setPerfDict] = useRecoilState(performanceState);

  const createBooking = async () => {
    setSubmitting(true);
    const newPerf: Partial<PerformanceDTO> = {
      BookingId: bookingId,
      Date: date,
    };

    try {
      const { data } = await axios.post('/api/performances/create', newPerf);
      setSubmitting(false);
      const newState = { ...perfDict, [data.Id]: data };
      setPerfDict(newState);

      reset();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="text-lg mb-2 text-center">Performance</h3>
      <DateTimeSelector setDate={setDate} date={date} />
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={reset} text="Cancel" />
        <FormInputButton onClick={createBooking} disabled={submitting} intent="PRIMARY" text="Create" />
      </div>
    </>
  );
};
