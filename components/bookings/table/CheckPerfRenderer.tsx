import { ICellRendererParams } from 'ag-grid-community';
import { SelectOption } from 'components/core-ui-lib/SelectOld/Select';
import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import { useEffect, useState } from 'react';

interface CheckPerfRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const CheckPerfRenderer = ({ eGridCell, data, dayTypeOptions, node, setValue }: CheckPerfRendererProps) => {
  const [perfChecked, setPerfChecked] = useState(false);
  const performanceOption = dayTypeOptions?.find(({ text }) => text === 'Performance');

  useEffect(() => {
    const isChecked = data.perf || (performanceOption && data.dayType === performanceOption.value);
    setValue(isChecked);
    setPerfChecked(isChecked);
  }, [data, dayTypeOptions]);

  const handleCheckboxChange = (checked) => {
    setPerfChecked(checked);
    setValue(checked);
    node.setData({
      ...data,
      perf: checked,
      dayType: checked ? performanceOption.value : '',
    });
  };

  return (
    <CheckboxRenderer
      eGridCell={eGridCell}
      name="perfCheckbox"
      checked={perfChecked}
      onChange={handleCheckboxChange}
      id="perf"
    />
  );
};
export default CheckPerfRenderer;
