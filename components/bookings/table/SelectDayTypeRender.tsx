import { useEffect, useRef, useState } from 'react';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import Typeahead from 'components/core-ui-lib/Typeahead';

interface SelectDayTypeRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const SelectDayTypeRender = ({
  data,
  value,
  setValue,
  node,
  dayTypeOptions,
  eGridCell,
}: SelectDayTypeRendererProps) => {
  const [selectedDateType, setSelectedDateType] = useState<string>('');
  const elRef = useRef(null);

  useEffect(() => {
    if (data && dayTypeOptions) {
      const performance = dayTypeOptions?.find(({ text }) => text === 'Performance');
      const dayTypeIndex = data.perf ? performance.value : value;
      setSelectedDateType(dayTypeIndex);
    }
  }, [data, value, dayTypeOptions]);

  useEffect(() => {
    if (eGridCell) {
      const setFocus = () => {
        elRef?.current?.focus();
      };
      eGridCell.addEventListener('focusin', setFocus);

      return () => {
        eGridCell.removeEventListener('focusin', setFocus);
      };
    }
  }, [eGridCell]);

  const handleChange = (selectedValue) => {
    const dayTypeOption = dayTypeOptions?.find(({ value }) => value === selectedValue);
    const isBooking = dayTypeOption && dayTypeOption.text === 'Performance';
    const isRehearsal = dayTypeOption && dayTypeOption.text === 'Rehearsal';
    const isGetInFitUp = dayTypeOption && dayTypeOption.text === 'Get in / Fit Up';
    setValue(selectedValue);
    node.setData({ ...data, perf: isBooking, dayType: selectedValue, isBooking, isRehearsal, isGetInFitUp });
  };

  return (
    <div className="pl-1 pr-2 mt-1" tabIndex={1}>
      <Typeahead
        ref={elRef}
        options={dayTypeOptions}
        value={selectedDateType}
        onChange={handleChange}
        inline
        isSearchable={false}
      />
    </div>
  );
};

export default SelectDayTypeRender;
