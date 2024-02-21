import { useEffect, useMemo, useState } from 'react';
import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';

const SelectDayTypeRender = (props: CustomCellRendererProps) => {
  const dayTypeOptions = [
    '-',
    'Performance',
    'Rehearsal',
    'Day Off',
    'Travel Day',
    'Declared Holiday',
    'Start of Tour',
    'End of Tour',
    'Get in / Fit Up',
    'Get Out',
    'Tech / Dress',
    'Potential Tour Extension',
    'TBA',
    'UK Dates',
    'USA Dates',
    'Europe Dates',
    'International Dates',
    'Scottish Dates',
    'English Dates',
    'Irish Dates',
    'Northern Irish Dates',
    'Welsh Dates',
    'Bank Holiday',
    'UK Bank Holiday',
    'Irish Bank Holiday',
    'UK / Irish Bank Holiday',
    'Easter Weekend',
  ];

  const mappedDayTypeOptions = useMemo(
    () =>
      dayTypeOptions.map((value) => ({
        text: value,
        value,
      })),
    [],
  );

  const [initialValue, setInitialValue] = useState(props.data.perf ? 'Performance' : '-');

  useEffect(() => {
    setInitialValue(props.data.perf ? 'Performance' : '-');
  }, [props.data.perf]);

  const handleChange = (selectedValue) => {
    props.node.setDataValue('dayType', selectedValue);

    props.node.setDataValue('perf', selectedValue === 'Performance');
  };

  console.log('props >>> daytype:>> ', props.node);
  return (
    <div className="w-[98%] h-full mx-auto  ">
      <Select
        options={mappedDayTypeOptions}
        value={initialValue}
        className="!shadow-none border-none"
        buttonClass=" border border-primary-border "
        onChange={handleChange}
      />
    </div>
  );
};

export default SelectDayTypeRender;
