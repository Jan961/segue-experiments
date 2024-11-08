import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams, IRowNode } from 'ag-grid-community';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { useEffect, useState } from 'react';

interface SelectVenueRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
  venueOptions: SelectOption[];
}

export default function SelectVenueRenderer({
  venueOptions,
  eGridCell,
  data,
  value,
  node,
  api,
  setValue,
}: SelectVenueRendererProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleVenueChange = (venue: number) => {
    if (data.isRunOfDates && node.rowIndex === 0) {
      api.forEachNode((node: IRowNode) => node.setData({ ...node.data, venue }));
    } else {
      setValue(venue);
    }
  };

  useEffect(() => {
    console.log(value);
    if (data) {
      if (data.isRunOfDates) {
        setIsDisabled(node.rowIndex > 0);
      }
      setValue(value);
    }
  }, [data, node]);

  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        options={venueOptions}
        value={value}
        inline
        onChange={handleVenueChange}
        isSearchable
        disabled={isDisabled}
        isClearable={false}
      />
    </div>
  );
}
