import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import Select from 'components/core-ui-lib/Select';
import { useEffect, useState } from 'react';

interface SelectPencilRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const pencilNos = [{ text: '-', value: '9' }].concat(
  Array.from({ length: 9 }, (_, index) => ({ text: `${index}`, value: `${index}` })),
);

const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];

const SelectPencilRenderer = ({ value, data, dayTypeOptions }: SelectPencilRendererProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    const dayType = dayTypeOptions.find(({ value }) => value === data.dayType);
    setIsDisabled(dayType && DAY_TYPE_FILTERS.includes(dayType.text));
  }, [data, dayTypeOptions]);

  return (
    <div className="pl-1 pr-2">
      <Select
        onChange={(value) => ({ target: { id: 'pencilNo', value } })}
        options={pencilNos}
        value={value.toString()}
        buttonClass=" border border-primary-border"
        inline
        disabled={isDisabled}
      />
    </div>
  );
};

export default SelectPencilRenderer;
