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

  return (
    <div className="pl-1 pr-2">
    <Select
      onChange={(selectedVal) => setOption(selectedVal)}
      options={options}
      value={value}
      inline
      placeHolder='-'
    />
  </div>
  );
};

export default SelectCompOrderRender;
