import { CustomCellRendererProps } from 'ag-grid-react';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { useEffect, useState } from 'react';

const CheckPerfRender = (props: CustomCellRendererProps) => {
  const [perfChecked, setPerfChecked] = useState(false);

  useEffect(() => {
    setPerfChecked(props.data.perf);
  }, [props.data.dayType]);

  const handleCheckboxChange = () => {
    setPerfChecked(!perfChecked);

    props.node.setDataValue('perf', !perfChecked);

    if (props.data.perf) {
      props.node.setDataValue('dayType', 'Performance');
    } else {
      props.node.setDataValue('dayType', '-');
      props.node.setDataValue('noPerf', 0);
    }
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
export default CheckPerfRender;