import { CustomCellRendererProps } from 'ag-grid-react';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { useState } from 'react';

const SelectableColumnRenderer = (props: CustomCellRendererProps) => {
  const { value, node, rowIndex } = props;
  const [checked, setChecked] = useState<boolean>(node.isSelected());
  const onChange = (e: any) => {
    setChecked(e.target.value);
    node?.setSelected(e.target.value);
  };
  return (
    <div className="flex items-center gap-2 px-2">
      <Checkbox className="!w-fit" label="" id={rowIndex + ''} checked={checked} onChange={onChange} />
      <div>{value}</div>
    </div>
  );
};

export default SelectableColumnRenderer;
