import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams, IRowNode } from 'ag-grid-community';

import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { useEffect, useState } from 'react';
import { statusOptions } from 'config/bookings';

interface SelectPencilRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const pencilNos = Array.from({ length: 9 }, (_, index) => ({ text: `${index + 1}`, value: `${index + 1}` }));

const SelectPencilRenderer = ({ eGridCell, value, setValue, data, api, node }: SelectPencilRendererProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleValueChange = (value) => {
    node.setData({ ...data, pencilNo: value });
    if (data.isRunOfDates) {
      api.forEachNode((node: IRowNode) => node.setData({ ...node.data, pencilNo: value }));
    }
  };

  useEffect(() => {
    if (data) {
      const { dayType, bookingStatus } = data;
      const pencilled = statusOptions.find(({ text }) => text === 'Pencilled').value;

      setIsDisabled(
        (node.rowIndex > 0 && data.isRunOfDates) || dayType === null || dayType === '' || bookingStatus !== pencilled,
      );
      if (!data.isRunOfDates) {
        setValue(dayType === null || dayType === '' || bookingStatus !== pencilled ? null : value);
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
        options={pencilNos}
        value={`${value > 0 ? value : ''}`}
        inline
        isSearchable={false}
        disabled={isDisabled}
      />
    </div>
  );
};

export default SelectPencilRenderer;
