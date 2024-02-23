import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { venueState } from 'state/booking/venueState';

export default function SelectVenueRender(props: CustomCellRendererProps) {
  const venueDict = useRecoilValue(venueState);
  const bookingDict = useRecoilValue(bookingState);
  const [isDayOff, setIsDayOff] = useState(false);
  //   console.log('venueDict :>> ', venueDict);
  //   console.log('bookingDict :>> ', bookingDict);

  const VenueOptions = useMemo(() => {
    const options = [];
    const currentProductionVenues = Object.values(bookingDict).map((booking) => booking.VenueId);
    for (const venueId in venueDict) {
      const venue = venueDict[venueId];
      const option = {
        text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
        value: venue?.Id,
      };
      if (currentProductionVenues.includes(parseInt(venueId, 10))) {
        continue;
      }
      options.push(option);
    }
    return options;
  }, [venueDict, bookingDict]);

  useEffect(() => {
    console.log('use effect selectVenuRender ');
    if (props.data.dayType === 'Day Off') {
      setIsDayOff(true);
      console.log('props.data.dayType >>:>> ', props.data.dayType);
    } else {
      setIsDayOff(false);
    }
  }, [props.data.dayType]);
  console.log('props.value :>> ', props);
  return (
    <>
      {isDayOff ? (
        <p>Day off</p>
      ) : (
        <div className="w-[98%] h-full mx-auto">
          <Select
            options={VenueOptions}
            value={props.value}
            className="!shadow-none border-none"
            buttonClass=" border border-primary-border !text-red-500"
          />
        </div>
      )}
    </>
  );
}
