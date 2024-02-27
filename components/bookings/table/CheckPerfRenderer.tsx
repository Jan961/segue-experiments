import { ICellRendererParams } from 'ag-grid-community';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { useEffect, useState } from 'react';

interface CheckPerfRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const CheckPerfRenderer = ({ data, dayTypeOptions, node }: CheckPerfRendererProps) => {
  const [perfChecked, setPerfChecked] = useState(false);

  useEffect(() => {
    const dayType = dayTypeOptions.find(({ value }) => value === data.dayType);
    setPerfChecked(dayType && dayType.text === 'Performance');
  }, [data.dayType, dayTypeOptions]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setPerfChecked(checked);
    node.setData({
      ...data,
      perf: !perfChecked,
      dayType: checked ? 'Performance' : '-',
      noPerf: checked ? data.noOfPerfs : 0,
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
