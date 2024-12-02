import { ICellRendererParams } from 'ag-grid-community';
import DateInput from 'components/core-ui-lib/DateInput';
import { useRef, useState } from 'react';
import { newDate } from 'services/dateService';

interface CustomDateCellRendererParams extends ICellRendererParams {
  disableAnimations?: boolean;
  defaultMinDateToToday?: boolean;
  isRequired?: boolean;
}

const DateRenderer = ({
  data,
  colDef,
  value,
  setValue,
  node,
  disableAnimations = false,
  defaultMinDateToToday = true,
  isRequired = false,
}: CustomDateCellRendererParams) => {
  const fromInputRef = useRef(null);
  const [error, setError] = useState<string>('');

  const [date, setDate] = useState(newDate(value) || null);

  const handleDateFromChange = (dateVal) => {
    setError('');
    setDate(dateVal);
    setValue(dateVal?.toISOString());
    node.setData({
      ...data,
      [colDef?.field]: dateVal?.toISOString(),
    });
    if (!dateVal) {
      setError('error');
    }
  };

  return (
    <div className="ag-input-wrapper w-full h-full pr-[2px] rounded">
      <DateInput
        ref={fromInputRef}
        popperClassName="ag-custom-component-popup !z-50 rounded"
        inputClass={`!shadow-none  ${error && isRequired ? '!border-primary-red' : '!border-primary-white'}`}
        value={date}
        onChange={handleDateFromChange}
        minDate={defaultMinDateToToday ? newDate() : null}
        error={!disableAnimations && error}
      />
    </div>
  );
};

export default DateRenderer;
