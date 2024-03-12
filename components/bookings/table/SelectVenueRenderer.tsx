import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';

interface SelectVenueRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
  venueOptions: SelectOption[];
}

const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];

export default function SelectVenueRenderer({
  venueOptions,
  dayTypeOptions,
  eGridCell,
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
    <div className="pl-1 pr-2 mt-1">
      {showDayType ? (
        <div className="mt-1 p-2 border border-primary-border rounded-md w-full h-[1.9375rem] bg-primary-white flex items-center">
          <span className="text-primary-input-text text-base font-bold leading-6">{selectedDayTypeOption.text}</span>
        </div>
      ) : (
        <SelectRenderer
          eGridCell={eGridCell}
          options={venueOptions}
          value={value}
          inline
          onChange={handleVenueChange}
          isSearchable
        />
      )}
    </div>
  );
}
