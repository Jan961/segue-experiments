<<<<<<< HEAD
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
=======
import Select from 'components/core-ui-lib/Select';
import { ICellRendererParams } from 'ag-grid-community';
import { getNumericalOptions } from 'utils/getNumericalOptions';


interface SelectCompOrderRenderProps extends ICellRendererParams {
  optionsLength: number;
  bookingId: number;
  selectForComparison: (value) => void
}

const SelectCompOrderRender = ({ value, setValue, selectForComparison, ...props }: SelectCompOrderRenderProps) => {
  const options = getNumericalOptions(props.optionsLength + 1);
  const setOption = (selectedVal: string) => {
    setValue(selectedVal);
    selectForComparison({
      order: parseInt(selectedVal), 
      BookingId: props.data.BookingId,
      prodCode: props.data.prodCode,
      prodName: props.data.prodName,
      numPerfs: props.data.numPerfs
    });
  }
>>>>>>> b951a0f (SalesTable component added, Venue History integrates new component, table UI perfected)

  return (
    <div className="pl-1 pr-2">
    <Select
<<<<<<< HEAD
      onChange={handleChange}
      options={options}
      value={selectedOrderVal}
      inline
=======
      onChange={(selectedVal) => setOption(selectedVal)}
      options={options}
      value={value}
      inline
      placeHolder='-'
>>>>>>> b951a0f (SalesTable component added, Venue History integrates new component, table UI perfected)
    />
  </div>
  );
};

export default SelectCompOrderRender;
