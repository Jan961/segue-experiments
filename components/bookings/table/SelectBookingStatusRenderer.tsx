import { CustomCellRendererProps } from 'ag-grid-react';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { statusOptions } from 'config/bookings';

const SelectBookingStatusRenderer = ({ eGridCell, value, setValue }: CustomCellRendererProps) => {
  return (
    <div className="pl-1 pr-2 mt-1">
      <SelectRenderer
        eGridCell={eGridCell}
        onChange={(value) => setValue(value)}
        options={statusOptions}
        value={value}
        inline
        isSearchable={false}
      />
    </div>
  );
};

export default SelectBookingStatusRenderer;
