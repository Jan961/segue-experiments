import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';

import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';

interface SelectPencilRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const pencilNos = [{ text: '-', value: '8' }].concat(
  Array.from({ length: 9 }, (_, index) => ({ text: `${index + 1}`, value: `${index + 1}` })),
);

const SelectPencilRenderer = ({ eGridCell, value, setValue }: SelectPencilRendererProps) => {
  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        onChange={(value) => setValue(value)}
        options={pencilNos}
        value={value.toString()}
        inline
        isSearchable={false}
      />
    </div>
  );
};

export default SelectPencilRenderer;
