import { ICellRendererParams } from 'ag-grid-community';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { useEffect, useState } from 'react';

interface CheckPerfRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const CheckPerfRenderer = ({ data, dayTypeOptions, node, setValue }: CheckPerfRendererProps) => {
  const [perfChecked, setPerfChecked] = useState(false);
  const performanceOption = dayTypeOptions?.find(({ text }) => text === 'Performance');

  useEffect(() => {
    setPerfChecked(data.perf || (performanceOption && data.dayType === performanceOption.value));
  }, [data, dayTypeOptions]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setPerfChecked(checked);
    setValue(checked);
    node.setData({
      ...data,
      perf: checked,
      dayType: checked ? performanceOption.value : '',
    });
  };

  return (
    <Checkbox
      name="perfCheckbox"
      checked={perfChecked}
      onChange={handleCheckboxChange}
      id="perf"
      className="w-[1.1875rem] h-[1.1875rem]"
    />
  );
};
export default CheckPerfRenderer;
