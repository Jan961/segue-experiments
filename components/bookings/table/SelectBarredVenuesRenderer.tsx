import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';

interface SelectVenueRendererProps extends ICellRendererParams {
  venueOptions: SelectOption[];
}

export default function SelectBarredVenuesRenderer({
  venueOptions,
  eGridCell,
  value,
  setValue,
}: SelectVenueRendererProps) {
  const handleVenueChange = (venue) => {
    setValue(venue);
  };

  return (
    <div className="pl-1 pr-2 mt-1">
      <div className="mt-1 p-2 border border-primary-border rounded-md w-full h-[1.9375rem] bg-primary-white flex items-center"></div>

      <SelectRenderer
        eGridCell={eGridCell}
        options={venueOptions}
        value={value}
        inline
        onChange={handleVenueChange}
        isSearchable
      />
    </div>
  );
}
