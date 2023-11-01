import { useRecoilState, useRecoilValue } from 'recoil';
import { rehearsalState } from 'state/booking/rehearsalState';
import { viewState } from 'state/booking/viewState';

interface RehearsalDisplayProps {
  rehearsalId: number;
  date: string;
}

export const RehearsalDisplay = ({ rehearsalId, date }: RehearsalDisplayProps) => {
  const rehearsalDict = useRecoilValue(rehearsalState);
  const [view, setView] = useRecoilState(viewState);

  if (!rehearsalId) return null;

  const r = rehearsalDict[rehearsalId];

  const select = () => {
    setView({ ...view, selected: { type: 'rehearsal', id: rehearsalId }, selectedDate: date });
  };

  const active = view.selected?.id === rehearsalId && view.selected?.type === 'rehearsal';

  return (
    <div
      className={`p-1 px-2 rounded
        border border-l-8 
        border-red-500 bg-red-200
        grid grid-cols-10
        ${active ? 'bg-red-400 shadow' : 'hover:bg-red-300'}
       `}
      onClick={select}
    >
      <div className="col-span-7 text-center">Rehearsal: {r.Town ? r.Town : 'N/A'}</div>
    </div>
  );
};
