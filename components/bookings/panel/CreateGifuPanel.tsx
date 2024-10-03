import axios from 'axios';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector';
import { VenueSelector } from './components/VenueSelector';
import { getDateBlockId } from './utils/getDateBlockId';
import { viewState } from 'state/booking/viewState';
import { CreateGifuParams } from 'pages/api/gifu/create';
import { getInFitUpState } from 'state/booking/getInFitUpState';

interface CreateGifuPanelProps {
  finish: () => void;
}

export const CreateGifuPanel = ({ finish }: CreateGifuPanelProps) => {
  const [venueId, setVenueId] = React.useState<number>(undefined);
  const { selectedDate } = useRecoilValue(viewState);
  const schedule = useRecoilValue(scheduleSelector);
  const DateBlockId = getDateBlockId(schedule, selectedDate);
  const [gifuDict, setGifuDict] = useRecoilState(getInFitUpState);

  const createGifu = async () => {
    const newDate: CreateGifuParams = { DateBlockId, Date: selectedDate, VenueId: venueId, RunTag: 'GIFU' };
    const { data } = await axios.post('/api/gifu/create', newDate);
    const newState = { ...gifuDict, [data.Id]: data };
    setGifuDict(newState);
    finish();
  };

  return (
    <>
      <h3 className="text-lg mb-2 text-center">Get-In Fit-Up</h3>
      <div className="p-4 pb-px mb-4 rounded-lg bg-primary-blue">
        <VenueSelector venueId={venueId} onChange={(value: number) => setVenueId(value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={finish} text="Cancel" />
        <FormInputButton onClick={createGifu} disabled={!venueId} intent="PRIMARY" text="Create" />
      </div>
    </>
  );
};
