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
  node,
  data,
  colDef,
}: SelectVenueRendererProps) {
  const handleVenueChange = (venue) => {
    setValue(venue);
    node.setData({ ...data, [colDef?.field]: value });
  };

  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        options={venueOptions}
        value={value}
        inline
        onChange={handleVenueChange}
        isSearchable
        isClearable={false}
        label={'Venue'}
      />
    </div>
  );
}
