import { ICellRendererParams } from 'ag-grid-community';
import DateInput from 'components/core-ui-lib/DateInput';
import { useRef, useState } from 'react';

const CustomDateCell = ({ data, colDef: { field } }: ICellRendererParams) => {
  const [value, setValue] = useState(data[field]);
  const fromInputRef = useRef(null);
  const [error, setError] = useState<string>('');

  const handleDateFromChange = (dateVal) => {
    setValue(dateVal);
    setError('');
    // node.setData({
    //   ...data,
    //   [colDef]: dateVal,
    // });
    if (!dateVal) {
      setError('error');
    }
  };

  console.log(data[field]);

  return (
    <div className="ag-input-wrapper w-full h-full pr-[2px] rounded">
      <DateInput
        ref={fromInputRef}
        popperClassName="ag-custom-component-popup !z-50 rounded"
        inputClass={`!shadow-none !border-primary-white`}
        value={value}
        onChange={handleDateFromChange}
        minDate={new Date()}
        error={error}
      />
    </div>
  );
};

export default CustomDateCell;
