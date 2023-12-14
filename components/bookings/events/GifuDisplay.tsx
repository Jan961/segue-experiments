import { useRecoilState, useRecoilValue } from 'recoil';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { venueState } from 'state/booking/venueState';
import { viewState } from 'state/booking/viewState';

interface GifuDisplayProps {
  gifuId: number;
  date: string;
}

export const GifuDisplay = ({ gifuId, date }: GifuDisplayProps) => {
  const gifuDict = useRecoilValue(getInFitUpState);
  const venueDict = useRecoilValue(venueState);
  const [view, setView] = useRecoilState(viewState);

  if (!gifuDict) return null;

  const g = gifuDict[gifuId];
  const { Name } = venueDict[g.VenueId];

  const select = () => {
    setView({ ...view, selected: { type: 'gifu', id: gifuId }, selectedDate: date });
  };

  const active = view.selected?.id === gifuId && view.selected?.type === 'gifu';

  return (
    <div
      className={`${active ? 'bg-primary-blue text-white' : ''} cursor-pointer p-1 px-2 rounded grid grid-cols-10`}
      onClick={select}
    >
      <div className="col-span-7 text-center">GIFU: {Name}</div>
    </div>
  );
};
