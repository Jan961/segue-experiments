import { IRowNode } from 'ag-grid-community';
import { CustomCellRendererProps } from 'ag-grid-react';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { statusOptions } from 'config/bookings';
import { useEffect, useState } from 'react';

const SelectBookingStatusRenderer = ({ eGridCell, value, setValue, data, node, api }: CustomCellRendererProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      if (data.isRunOfDates && node.rowIndex > 0) {
        setIsDisabled(true);
      }
    }
  }, [data, node]);

  const handleValueChange = (value) => {
    setValue(value);
    if (data.isRunOfDates && node.rowIndex === 0) {
      api.forEachNode((node: IRowNode) => node.setData({ ...node.data, bookingStatus: value }));
    }
  };

  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        onChange={handleValueChange}
        options={statusOptions}
        value={value}
        inline
        isSearchable={false}
        disabled={isDisabled}
      />
    </div>
  );
};

export default SelectBookingStatusRenderer;
