import { CustomCellRendererProps } from 'ag-grid-react';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { useState } from 'react';

const SelectableColumnRenderer = (props: CustomCellRendererProps) => {
  const { value, node } = props;
  const [checked, setChecked] = useState<boolean>(node.isSelected());
  const onChange = (e: any) => {
    setChecked(e.value);
    setTimeout(() => node?.setSelected(e.value), 0);
  };
  return (
    <div className="flex items-center gap-2 px-2">
      <Checkbox className="!w-fit" label="" id={props.data.VenueId} checked={checked} onChange={onChange} />
      <div className={``}>{value}</div>
    </div>
  );
};

export default SelectableColumnRenderer;
