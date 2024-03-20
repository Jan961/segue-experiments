import { useEffect, useMemo, useState } from 'react';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { statusOptions } from 'config/bookings';

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
  const pencilledStatus = statusOptions.find(({ text }) => text === 'Pencilled').value;
  const [selectedDateType, setSelectedDateType] = useState<string>('');
  const formattedOptions = useMemo(
    () => [
      {
        text: '',
        value: null,
      },
      ...dayTypeOptions,
    ],
    [dayTypeOptions],
  );

  useEffect(() => {
    if (data && dayTypeOptions) {
      const performance = dayTypeOptions?.find(({ text }) => text === 'Performance');
      const dayTypeIndex = data.perf ? performance.value : value;
      setSelectedDateType(dayTypeIndex);
    }
  }, [data, value, dayTypeOptions, node]);

  const handleChange = (selectedValue) => {
    const dayTypeOption = dayTypeOptions?.find(({ value }) => value === selectedValue);
    const isBooking = dayTypeOption && dayTypeOption.text === 'Performance';
    const isRehearsal = dayTypeOption && dayTypeOption.text === 'Rehearsal';
    const isGetInFitUp = dayTypeOption && dayTypeOption.text === 'Get in / Fit Up';
    setValue(selectedValue);
    node.setData({
      ...data,
      perf: isBooking,
      dayType: selectedValue,
      isBooking,
      isRehearsal,
      isGetInFitUp,
      bookingStatus: pencilledStatus,
    });
  };

  return (
    <div className="pl-1 pr-2 mt-1" tabIndex={1}>
      <SelectRenderer
        eGridCell={eGridCell}
        options={formattedOptions}
        value={selectedDateType}
        onChange={handleChange}
        inline
        isSearchable
      />
    </div>
  );
};

export default SelectDayTypeRender;
