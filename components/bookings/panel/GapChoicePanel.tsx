import axios from 'axios';
import classNames from 'classnames';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { CreateBookingsParams } from 'pages/api/bookings/create';
import { VenueWithDistance } from 'services/booking/gapSuggestion/types';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { VenueState, venueState } from 'state/booking/venueState';
import { viewState } from 'state/booking/viewState';
import { VenueInfo } from '../modal/VenueInfo';
import { getDateBlockId } from './utils/getDateBlockId';
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector';
import { NumericSliderRange } from './components/NumericSliderRange';
import { timeFormat } from 'services/dateService';

interface GapChoicePanelRowProps {
  info: VenueWithDistance;
  venueDict: VenueState;
  setActive: () => void;
  active?: boolean;
}

const getMinMaxCapacity = (venues: VenueWithDistance[]): [number, number] => {
  return venues.reduce(
    (acc: [number, number], venue: VenueWithDistance) => {
      if (venue.Capacity) {
        return [venue.Capacity < acc[0] ? venue.Capacity : acc[0], venue.Capacity > acc[1] ? venue.Capacity : acc[1]];
      } else {
        return acc;
      }
    },
    [Infinity, 0],
  ) as [number, number];
};

const GapChoicePanelRow = ({ info, venueDict, active, setActive }: GapChoicePanelRowProps) => {
  const baseClass = 'p-1 even:bg-gray-100 hover:bg-blue-200 cursor-pointer';

  return (
    <tr onClick={setActive} className={active ? classNames(baseClass, 'bg-blue-200 even:bg-blue-200') : baseClass}>
      <td className="px-1">{info.Capacity}</td>
      <td title={venueDict[info.VenueId].Name} className="px-1">
        {venueDict[info.VenueId].Name}
      </td>
      <td className="px-1 text-center">{timeFormat(info.MinsFromStart)}</td>
      <td className="px-1 text-center">{timeFormat(info.MinsFromEnd)}</td>
    </tr>
  );
};

interface GapChoicePanelProps {
  reset: () => void;
  gapVenues: VenueWithDistance[];
}

export const GapChoicePanel = ({ reset, gapVenues }: GapChoicePanelProps) => {
  const venueDict = useRecoilValue(venueState);
  const [bookingDict, setBookingDict] = useRecoilState(bookingState);
  const { selectedDate } = useRecoilValue(viewState);
  const [selectedVenue, setSelectedVenue] = React.useState<number>(undefined);
  const [capacityMin, capacityMax] = getMinMaxCapacity(gapVenues);
  const [capacityValue, setCapacityValue] = React.useState<[number, number]>([capacityMin, capacityMax]);
  const schedule = useRecoilValue(scheduleSelector);
  const DateBlockId = getDateBlockId(schedule, selectedDate);

  const cancel = () => {
    reset();
  };

  const sorted = gapVenues.sort((a, b) => a.MinsFromStart + a.MinsFromEnd - (b.MinsFromStart + b.MinsFromEnd));

  const createBooking = async () => {
    const newDate: CreateBookingsParams = { DateBlockId, Date: selectedDate, VenueId: selectedVenue };
    const { data } = await axios.post('/api/bookings/create', newDate);
    const newState = { ...bookingDict, [data.Id]: data };
    setBookingDict(newState);
    cancel();
  };

  const isVisible = ({ Capacity }: VenueWithDistance) => Capacity >= capacityValue[0] && Capacity <= capacityValue[1];

  const filtered = sorted.filter(isVisible);
  const selectedVisible = filtered.filter((x) => x.VenueId === selectedVenue).length > 0;

  return (
    <>
      <h3 className="text-lg mb-2 text-center">Gap Suggest</h3>
      <NumericSliderRange
        name="Capacity"
        label="Capacity"
        min={capacityMin}
        max={capacityMax}
        value={capacityValue}
        isSlider={true}
        handleRangeChange={(value, _) => setCapacityValue(value)}
      />
      <div className="max-h-80 h-80 overflow-y-scroll border mb-2">
        <table className="text-xs w-full">
          <tr className="text-left">
            <th className="px-1">Cap</th>
            <th className="px-1">Name</th>
            <th className="px-1 whitespace-nowrap">A ➜ B</th>
            <th className="px-1 whitespace-nowrap">B ➜ C</th>
          </tr>
          {filtered.map((x) => (
            <GapChoicePanelRow
              key={x.VenueId}
              venueDict={venueDict}
              info={x}
              active={selectedVenue === x.VenueId}
              setActive={() => setSelectedVenue(x.VenueId)}
            />
          ))}
        </table>
      </div>
      <VenueInfo venueId={selectedVenue} />
      <div className="grid mt-2 grid-cols-2 gap-2">
        <FormInputButton onClick={cancel} text="Cancel" />
        <FormInputButton onClick={createBooking} disabled={!selectedVisible} intent="PRIMARY" text="Create" />
      </div>
    </>
  );
};
