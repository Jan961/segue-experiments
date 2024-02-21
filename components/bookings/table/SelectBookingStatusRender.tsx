import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';
import { statusOptions } from 'config/bookings';

const SelectBookingStatusRender = (props: CustomCellRendererProps) => {
  console.log('props.value :>> ', props.value);
  return (
    <div className="w-[98%] h-full mx-auto  ">
      <Select
        onChange={(value) => ({ target: { id: 'status', value } })}
        options={statusOptions}
        value={props.value}
        className="!shadow-none border-none"
        buttonClass=" border border-primary-border"
      />
    </div>
  );
};

export default SelectBookingStatusRender;
