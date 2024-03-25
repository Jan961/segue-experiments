<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { ICellRendererParams } from 'ag-grid-community';
import { getNumericalOptions } from 'utils/getNumericalOptions';

interface SelectCompOrderRenderProps extends ICellRendererParams {
  optionsLength: number;
  bookingId: number;
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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
<<<<<<< HEAD
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
import Select from 'components/core-ui-lib/Select';
import { ICellRendererParams } from 'ag-grid-community';
import { getNumericalOptions } from 'utils/getNumericalOptions';


interface SelectCompOrderRenderProps extends ICellRendererParams {
  optionsLength: number;
  bookingId: number;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
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
<<<<<<< HEAD
=======
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  selectForComparison: (value) => void
}

const SelectCompOrderRender = ({ value, setValue, selectForComparison, ...props }: SelectCompOrderRenderProps) => {
  const options = getNumericalOptions(props.optionsLength + 1);
  const setOption = (selectedVal: string) => {
<<<<<<< HEAD
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
const SelectCompOrderRender = ({ value, setValue, selectForComparison, ...props }: SelectCompOrderRenderProps) => {
  const options = getNumericalOptions(props.optionsLength + 1);
  const setOption = (selectedVal: string) => {
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
    setValue(selectedVal);
    selectForComparison({
      order: parseInt(selectedVal), 
      BookingId: props.data.BookingId,
      prodCode: props.data.prodCode,
      prodName: props.data.prodName,
      numPerfs: props.data.numPerfs
    });
  }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7

  return (
    <div className="pl-1 pr-2 mt-1">
    <Select
<<<<<<< HEAD
=======
>>>>>>> b951a0f (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

  return (
    <div className="pl-1 pr-2">
    <Select
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
      onChange={handleChange}
      options={options}
      value={selectedOrderVal}
      inline
<<<<<<< HEAD
=======
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
      onChange={(selectedVal) => setOption(selectedVal)}
      options={options}
      value={value}
      inline
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      placeholder='-'
=======
      placeHolder='-'
>>>>>>> b951a0f (SalesTable component added, Venue History integrates new component, table UI perfected)
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
      placeHolder='-'
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
      placeholder='-'
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
    />
  </div>
  );
};

export default SelectCompOrderRender;
