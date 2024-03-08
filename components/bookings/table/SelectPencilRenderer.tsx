import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams, IRowNode } from 'ag-grid-community';

import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { useEffect, useState } from 'react';

interface SelectPencilRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const pencilNos = [{ text: '-', value: '8' }].concat(
  Array.from({ length: 9 }, (_, index) => ({ text: `${index + 1}`, value: `${index + 1}` })),
);

const SelectPencilRenderer = ({ eGridCell, value, setValue, data, api, node }: SelectPencilRendererProps) => {
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
      api.forEachNode((node: IRowNode) => node.setData({ ...node.data, pencilNo: value }));
    }
  };
  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        onChange={handleValueChange}
        options={pencilNos}
        value={value.toString()}
        inline
        isSearchable={false}
        disabled={isDisabled}
      />
    </div>
  );
};

export default SelectPencilRenderer;
