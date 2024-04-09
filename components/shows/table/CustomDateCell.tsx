import { ICellRendererParams } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

interface CustomDateCellProps extends ICellRendererParams {
  internalField?: string;
  fieldIndex?: number;
}

const CustomDateCell = ({ data, colDef: { field }, internalField, fieldIndex }: CustomDateCellProps) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (internalField && fieldIndex) {
      if (data[field] && data[field].length > 0 && data[field][fieldIndex]) {
        setValue(data[field][fieldIndex][internalField]);
      }
    }
  }, []);

  return (
    <div className="ag-input-wrapper w-full h-full pr-[2px] rounded">
      <DatePicker
        portalId="root"
        dateFormat={'dd/mm/yy'}
        placeholderText="DD/MM/YY"
        popperClassName="ag-custom-component-popup !z-50 rounded"
        onChange={(date) => setValue(date)}
        value={value}
      />
    </div>
  );
};

export default CustomDateCell;
