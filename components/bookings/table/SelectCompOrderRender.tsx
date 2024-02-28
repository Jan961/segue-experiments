import { useEffect, useState } from 'react';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import { getNumericalOptions } from 'utils/getNumericalOptions';

interface SelectCompOrderRenderProps extends ICellRendererParams {
  optionsLength: number;
  bookingId: number;
}

const SelectCompOrderRender = ({ value, node, optionsLength, bookingId }: SelectCompOrderRenderProps) => {
  const [selectedOrderVal, setSelectedOrderVal] = useState(null);

  const options = getNumericalOptions(optionsLength);
  console.log(options);

  useEffect(() => {
    setSelectedOrderVal(value);
  }, [value]);

  const handleChange = (selectedValue) => {
    alert(selectedValue)
  };

  return (
    <div className="pl-1 pr-2">
    <Select
      onChange={handleChange}
      options={options}
      value={selectedOrderVal}
      inline
    />
  </div>
  );
};

export default SelectCompOrderRender;
