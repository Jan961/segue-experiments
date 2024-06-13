import { ICellRendererParams } from 'ag-grid-community';
import DateInput from 'components/core-ui-lib/DateInput';
import { useRef, useState } from 'react';

interface CustomDateCellRendererParams extends ICellRendererParams {
  disableAnimations?: boolean;
  defaultMinDateToToday?: boolean;
}

const DateRenderer = ({
  data,
  colDef,
  value,
  setValue,
  node,
  disableAnimations,
  defaultMinDateToToday = true,
}: CustomDateCellRendererParams) => {
  const fromInputRef = useRef(null);
  const [error, setError] = useState<string>('');

  const [date, setDate] = useState(value || null);

  const handleDateFromChange = (dateVal) => {
    setError('');
    setDate(dateVal);
    setValue(dateVal);
    node.setData({
      ...data,
      [colDef?.field]: dateVal,
    });
    if (!disableAnimations && !dateVal) {
      setError('error');
    }
  };

  return (
    <div className="ag-input-wrapper w-full h-full pr-[2px] rounded">
      <DateInput
        ref={fromInputRef}
        popperClassName="ag-custom-component-popup !z-50 rounded"
        inputClass="!shadow-none !border-primary-white"
        value={date}
        onChange={handleDateFromChange}
        minDate={defaultMinDateToToday ? new Date() : null}
        error={error}
      />
    </div>
  );
};

export default DateRenderer;
