import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import Select from 'components/core-ui-lib/Select';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { venueState } from 'state/booking/venueState';

interface SelectVenueRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];

export default function SelectVenueRenderer({ dayTypeOptions, data, value, node }: SelectVenueRendererProps) {
  const venueDict = useRecoilValue(venueState);
  const bookingDict = useRecoilValue(bookingState);
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => data.dayType === value);
  const showDayType = selectedDayTypeOption && !DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text);

  const venueOptions = useMemo(() => {
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

  const handleVenueChange = (venue) => {
    node.setData({ ...data, venue });
  };

  return (
    <div className="pl-1 pr-2">
      <Select
        options={showDayType ? dayTypeOptions : venueOptions}
        value={showDayType ? data.dayType : value}
        inline
        onChange={handleVenueChange}
      />
    </div>
  );
}
