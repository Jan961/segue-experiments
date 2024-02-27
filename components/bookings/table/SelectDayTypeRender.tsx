import { useEffect, useState } from 'react';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';

interface SelectDayTypeRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const SelectDayTypeRender = ({ value, node, dayTypeOptions }: SelectDayTypeRendererProps) => {
  const [selectedDateType, setSelectedDateType] = useState<string>('');

  useEffect(() => {
    setSelectedDateType(value);
  }, [value]);

  const handleChange = (selectedValue) => {
    node.setDataValue('dayType', selectedValue);
    node.setDataValue('perf', selectedValue === 'Performance');
  };

  return (
    <div className="pl-1 pr-2">
      <Select options={dayTypeOptions} value={selectedDateType} onChange={handleChange} inline />
    </div>
  );
};

export default SelectDayTypeRender;
