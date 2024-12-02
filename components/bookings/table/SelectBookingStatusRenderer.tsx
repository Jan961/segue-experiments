import { ICellRendererParams, IRowNode } from 'ag-grid-community';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { statusOptions } from 'config/bookings';
import { useEffect, useMemo, useState } from 'react';
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
    setValue(value);
    node.setData({ ...data, bookingStatus: value });
    if (data.isRunOfDates && node.rowIndex === 0) {
      api.forEachNode((node: IRowNode) => node.setData({ ...node.data, bookingStatus: value }));
    }
  };

  useEffect(() => {
    if (data) {
      const { dayType } = data;
      setIsDisabled((node.rowIndex > 0 && data.isRunOfDates) || dayType === null || dayType === '');
      if (!data.isRunOfDates) {
        handleValueChange(dayType === null || dayType === '' ? null : value);
      } else if (node.rowIndex === 0 && value !== null && (dayType === null || dayType === '')) {
        handleValueChange(null);
      }
    }
  }, [data.perf, data.dayType]);

  const bookingStatusOptions = useMemo(() => {
    return statusOptions.filter((option) => option.text !== 'Available');
  }, []);

  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        onChange={handleValueChange}
        options={bookingStatusOptions}
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
