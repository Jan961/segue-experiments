import { ICellRendererParams, IRowNode } from 'ag-grid-community';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { statusOptions } from 'config/bookings';
import { useEffect, useState } from 'react';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

interface SelectBookingStatusRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const SelectBookingStatusRenderer = ({
  eGridCell,
  value,
  setValue,
  data,
  node,
  api,
}: SelectBookingStatusRendererProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleValueChange = (value) => {
    node.setData({ ...data, bookingStatus: value });
    if (data.isRunOfDates && node.rowIndex === 0) {
      api.forEachNode((node: IRowNode) => node.setData({ ...node.data, bookingStatus: value }));
    }
  };

  useEffect(() => {
    if (data) {
      const { dayType } = data;
      setIsDisabled(node.rowIndex > 0 || dayType === null || dayType === '');
      if (!data.isRunOfDates) {
        setValue(dayType === null || dayType === '' ? null : value);
      } else if (node.rowIndex === 0 && value !== null && (dayType === null || dayType === '')) {
        handleValueChange(null);
      }
    }
  }, [data, node]);

  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        onChange={handleValueChange}
        options={statusOptions}
        value={value}
        inline
        isSearchable={false}
        isClearable={false}
        disabled={isDisabled}
      />
    </div>
  );
};

export default SelectBookingStatusRenderer;
