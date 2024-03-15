import Select from 'components/core-ui-lib/Select';
import { ICellRendererParams } from 'ag-grid-community';
import { getNumericalOptions } from 'utils/getNumericalOptions';


interface SelectCompOrderRenderProps extends ICellRendererParams {
  optionsLength: number;
  bookingId: number;
  selectForComparison: (value) => void;
  selectedBookings;
}

const SelectCompOrderRender = ({ value, setValue, selectForComparison, selectedBookings, ...props }: SelectCompOrderRenderProps) => {
  let options = getNumericalOptions(props.optionsLength + 1);

    // Filter options to remove those where 'order' matches any 'selectedBooking.order'
    // options = options.filter(option => 
    //   !selectedBookings.some(selectedBooking => selectedBooking.order === parseInt(option.value))
    // );
  
  const setOption = (selectedVal) => {
    setValue(selectedVal);
    selectForComparison({
      order: parseInt(selectedVal), 
      BookingId: props.data.BookingId,
      prodCode: props.data.prodCode,
      prodName: props.data.prodName,
      numPerfs: props.data.numPerfs
    });
  }

  return (
    <div className="pl-1 pr-2 mt-1">
    <Select
      onChange={(selectedVal) => setOption(selectedVal)}
      options={options}
      value={value}
      inline
      placeholder='-'
    />
  </div>
  );
};

export default SelectCompOrderRender;
