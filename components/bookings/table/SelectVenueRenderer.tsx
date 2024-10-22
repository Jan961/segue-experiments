import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams, IRowNode } from 'ag-grid-community';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { useEffect, useState } from 'react';
import { getVenueForDayType } from '../utils';

interface SelectVenueRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
  venueOptions: SelectOption[];
}

export default function SelectVenueRenderer({
  venueOptions,
  dayTypeOptions,
  eGridCell,
  data,
  value,
  node,
  api,
  setValue,
}: SelectVenueRendererProps) {
  const venueAsDayType = getVenueForDayType(dayTypeOptions, data.dayType);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleVenueChange = (venue) => {
    setValue(venue);
    if (data.isRunOfDates && node.rowIndex === 0) {
      api.forEachNode((node: IRowNode) => node.setData({ ...node.data, venue }));
    }
  };

  useEffect(() => {
    if (data) {
      if (data.isRunOfDates) {
        setIsDisabled(node.rowIndex > 0);
      }
      setValue(venueAsDayType && !data.isRunOfDates ? null : value);
    }
  }, [data, node, setIsDisabled]);

  return (
    <div className="pl-1 pr-2 mt-1">
      {venueAsDayType && !data.isRunOfDates ? (
        <div className="mt-1 p-2 border border-primary-border rounded-md w-full h-[1.9375rem]  flex justify-center items-center">
          <span className="text-primary-input-text text-base font-bold leading-6 truncate">{venueAsDayType}</span>
        </div>
      ) : (
        <SelectRenderer
          eGridCell={eGridCell}
          options={venueOptions}
          value={value}
          inline
          onChange={handleVenueChange}
          isSearchable
          disabled={isDisabled}
          isClearable={!data.isRunOfDates}
        />
      )}
    </div>
  );
}
