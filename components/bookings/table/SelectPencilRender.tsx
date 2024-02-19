import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';

const SelectTableRender = (props: CustomCellRendererProps) => {
  console.log('props select table render:>> ', props);

  return (
    <div className="w-full h-full p-1">
      <Select options={props.colDef.options} value={props.value} />
    </div>
  );
};

export default SelectTableRender;
