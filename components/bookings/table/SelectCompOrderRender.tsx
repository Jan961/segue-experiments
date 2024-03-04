import { useEffect, useState } from 'react';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import { getNumericalOptions } from 'utils/getNumericalOptions';
import { statusOptions } from 'config/bookings';
import { CustomCellRendererProps } from 'ag-grid-react';

// interface SelectCompOrderRenderProps extends ICellRendererParams {
//   optionsLength: number;
//   bookingId: number;
// }

const SelectCompOrderRender = (props: CustomCellRendererProps) => {
  const [selectedOrderVal, setSelectedOrderVal] = useState(null);

  //const options = getNumericalOptions(optionsLength);
  //console.log(options);

  // useEffect(() => {
  //   setSelectedOrderVal(value);
  // }, [value]);

  const handleChange = (selectedValue) => {
    alert(selectedValue)
  };

  return (
    <div className="pl-1 pr-2">
    <Select
      onChange={(value) => ({ target: { id: 'status', value } })}
      options={statusOptions}
      value={props.value}
      inline
    />
  </div>
  );
};

export default SelectCompOrderRender;
