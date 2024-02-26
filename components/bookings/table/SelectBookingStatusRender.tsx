import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';
import { statusOptions } from 'config/bookings';

const SelectBookingStatusRender = (props: CustomCellRendererProps) => {
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

export default SelectBookingStatusRender;
