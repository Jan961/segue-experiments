import { CustomCellRendererProps } from 'ag-grid-react';
import Select from 'components/core-ui-lib/Select';
import { statusOptions } from 'config/bookings';

const SelectBookingStatusRenderer = ({ value, data, node }: CustomCellRendererProps) => {
  return (
    <div className="pl-1 pr-2">
      <Select
        onChange={(value) => node.setData({ ...data, bookingStatus: value })}
        options={statusOptions}
        value={value}
        inline
      />
    </div>
  );
};

export default SelectBookingStatusRenderer;
