import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import Select from 'components/core-ui-lib/Select';

interface SelectVenueRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
  venueOptions: SelectOption[];
}

const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];

export default function SelectVenueRenderer({
  venueOptions,
  dayTypeOptions,
  data,
  value,
  setValue,
}: SelectVenueRendererProps) {
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => data.dayType === value);
  const showDayType = selectedDayTypeOption && !DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text);

  const handleVenueChange = (venue) => {
    setValue(venue);
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
