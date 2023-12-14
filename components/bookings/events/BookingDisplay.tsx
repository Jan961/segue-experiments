import { PropsWithChildren } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { timeFormat } from 'services/dateService';
import { bookingState } from 'state/booking/bookingState';
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector';
import { venueState } from 'state/booking/venueState';
import { viewState } from 'state/booking/viewState';

interface VenueDisplayProps {
  bookingId: number;
  date: string;
  performanceCount: number;
}

export const BookingDisplay = ({ bookingId, performanceCount, date }: PropsWithChildren<VenueDisplayProps>) => {
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);
  const distanceDict = useRecoilValue(distanceDictSelector);
  const [view, setView] = useRecoilState(viewState);

  if (!bookingId) return null;

  const booking = bookingDict[bookingId];
  if (!booking) return null;

  const venue = venueDict[booking.VenueId];

  const options = distanceDict[booking.Date];
  const distance = options?.option?.filter((o) => o.VenueId === venue.Id)[0];

  const first = booking.Date.startsWith(date);
  const isCancelled = booking?.StatusCode === 'X';

  const select = () => {
    setView({ ...view, selected: { type: 'booking', id: bookingId }, selectedDate: date });
  };

  const active =
    view.selected?.id === bookingId && view.selected?.type === 'booking' && date.startsWith(view.selectedDate);
  return (
    <div
      className={`${
        active ? 'bg-primary-blue text-white' : ''
      } cursor-pointer grid grid-cols-10 p-1 px-2 rounded text-center
    ${isCancelled ? 'bg-black text-white border-black hover:bg-opacity-80 hover:bg-black not-italic' : ''}
    `}
      onClick={select}
    >
      <div className="col-span-4 text-center truncate">{venue ? venue.Name : 'No Venue'}</div>
      <div className="col-span-2 text-center truncate">{venue ? venue.Town : ''}</div>
      <div className="col-span-1 text-center">{venue ? venue.Seats : ''}</div>
      <div className="col-span-1">{performanceCount}</div>
      <div className="col-span-1 mx-2 whitespace-nowrap">
        {first && distance && <>{distance.Miles ? distance.Miles : ''}</>}
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap">{first && distance && <>{timeFormat(distance.Mins)}</>}</div>
    </div>
  );
};
