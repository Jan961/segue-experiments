import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import Select from 'components/core-ui-lib/Select';

interface SelectPencilRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const pencilNos = [{ text: '-', value: '8' }].concat(
  Array.from({ length: 9 }, (_, index) => ({ text: `${index + 1}`, value: `${index + 1}` })),
);

const SelectPencilRenderer = ({ value, setValue }: SelectPencilRendererProps) => {
  return (
    <div className="pl-1 pr-2">
      <Select
        onChange={(value) => setValue(value)}
        options={pencilNos}
        value={value.toString()}
        buttonClass=" border border-primary-border"
        inline
      />
    </div>
  );
};

export default SelectPencilRenderer;
