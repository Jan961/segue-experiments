import { first } from 'radash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { dateTypeState } from 'state/booking/dateTypeState';
import { otherState } from 'state/booking/otherState';
import { viewState } from 'state/booking/viewState';

interface OtherDisplayProps {
  otherId: number;
  date: string;
}

export const OtherDisplay = ({ otherId, date }: OtherDisplayProps) => {
  const otherDict = useRecoilValue(otherState);
  const dayTypeArray = useRecoilValue(dateTypeState);
  const [view, setView] = useRecoilState(viewState);

  if (!otherDict) return null;

  const o = otherDict[otherId];
  const match = first(dayTypeArray.filter((dt) => o.DateTypeId === dt.Id));

  const select = () => {
    setView({ ...view, selected: { type: 'other', id: otherId }, selectedDate: date });
  };

  const active = view.selected?.id === otherId && view.selected?.type === 'other';

  return (
    <div
      onClick={select}
      className={`${active ? 'bg-primary-blue text-white' : ''} 
      p-1 px-2 rounded grid grid-cols-10 cursor-pointer`}
    >
      <div className="col-span-7 text-center">{match?.Name}</div>
    </div>
  );
};
