import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';
const SelectTableRender = (props: CustomCellRendererProps) => {
  const pencilNo = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const mappedPencilNo = pencilNo.map((value) => {
    return { text: value === '' ? '-' : value, value };
  });
  return (
    <div className="w-full h-full p-1">
      <Select
        onChange={(value) => ({ target: { id: 'pencilNo', value } })}
        options={mappedPencilNo}
        value={props.value.toString()}
        className="!shadow-none border-none"
        buttonClass=" border border-primary-border"
      />
    </div>
  );
};

export default SelectTableRender;
