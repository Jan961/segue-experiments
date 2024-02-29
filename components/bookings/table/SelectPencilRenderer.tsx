import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import Select from 'components/core-ui-lib/Select';

interface SelectPencilRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const pencilNos = [{ text: '-', value: '9' }].concat(
  Array.from({ length: 9 }, (_, index) => ({ text: `${index}`, value: `${index}` })),
);

const SelectPencilRenderer = ({ value, node }: SelectPencilRendererProps) => {
  return (
    <div className="pl-1 pr-2">
      <Select
        onChange={(value) => node.setDataValue('pencilNo', value)}
        options={pencilNos}
        value={value.toString()}
        buttonClass=" border border-primary-border"
        inline
      />
    </div>
  );
};

export default SelectPencilRenderer;
