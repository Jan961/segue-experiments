import { ICellRendererParams } from 'ag-grid-community';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { useEffect, useState } from 'react';

interface CheckPerfRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const CheckboxRenderer = ({ eGridCell, data, node, setValue, value, colDef }: CheckPerfRendererProps) => {
  const [perfChecked, setPerfChecked] = useState<boolean>(false);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleCheckboxChange = (checked) => {
    setPerfChecked(checked);
    setValue(checked);
    console.log();
    node.setData({
      ...data,
      [colDef?.field]: checked,
    });
  };

  return <CheckboxRenderer eGridCell={eGridCell} checked={perfChecked} onChange={handleCheckboxChange} id="perf" />;
};
export default CheckboxRenderer;
