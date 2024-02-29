import { useEffect, useState } from 'react';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';

interface SelectDayTypeRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const SelectDayTypeRender = ({ data, value, node, dayTypeOptions }: SelectDayTypeRendererProps) => {
  const [selectedDateType, setSelectedDateType] = useState<string>('');

  useEffect(() => {
    if (data && dayTypeOptions) {
      const performance = dayTypeOptions?.find(({ text }) => text === 'Performance');
      const dayTypeIndex = data.perf ? performance.value : value;
      setSelectedDateType(dayTypeIndex);
    }
  }, [data, value, dayTypeOptions]);

  const handleChange = (selectedValue) => {
    node.setDataValue('dayType', selectedValue);
  };

  return (
    <div className="pl-1 pr-2">
      <Select options={dayTypeOptions} value={selectedDateType} onChange={handleChange} inline />
    </div>
  );
};

export default SelectDayTypeRender;
