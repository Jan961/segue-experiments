import { useEffect, useMemo, useState } from 'react';
import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';
import { dateTypeState } from 'state/booking/dateTypeState';
import { useRecoilValue } from 'recoil';

const SelectDayTypeRender = (props: CustomCellRendererProps) => {
  const dayTypes = useRecoilValue(dateTypeState);

  const DayTypeOptions = useMemo(
    () => [...dayTypes.map(({ Id: value, Name: text }) => ({ text, value })), { text: 'Performance', value: -1 }],
    [dayTypes],
  );

  const [initialValue, setInitialValue] = useState(props.data.perf ? 'Performance' : '-');

  useEffect(() => {
    setInitialValue(props.data.perf ? 'Performance' : '-');
  }, [props.data.perf]);

  const handleChange = (selectedValue) => {
    props.node.setDataValue('dayType', selectedValue);

    props.node.setDataValue('perf', selectedValue === 'Performance');
  };

  return (
    <div className="pl-1 pr-2">
      <Select options={DayTypeOptions} value={initialValue} onChange={handleChange} inline />
    </div>
  );
};

export default SelectDayTypeRender;
