import { ICellRendererParams } from 'ag-grid-community';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import { statusOptions } from 'config/bookings';
import { useEffect, useState } from 'react';

interface CheckPerfRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const CheckPerfRenderer = ({ eGridCell, data, dayTypeOptions, node, setValue, api }: CheckPerfRendererProps) => {
  const [perfChecked, setPerfChecked] = useState(false);
  const pencilledStatus = statusOptions.find(({ text }) => text === 'Pencilled').value;

  useEffect(() => {
    const isChecked = data.perf || data.dayType === -2;
    setValue(isChecked);
    setPerfChecked(isChecked);
  }, [data, dayTypeOptions]);

  const GetDayType = (checked: boolean) => {
    if (checked) {
      return -2; // Performance Code
    } else {
      if (node.rowIndex === 0) {
        return 15; // TBA code
      }
      return 6; // Day off Code
    }
  };

  const GetBookingStatus = (checked: boolean) => {
    if (checked) {
      if (data.rowIndex === 0) {
        return pencilledStatus;
      } else {
        return api.getRenderedNodes()[0].data.bookingStatus;
      }
    } else {
      return api.getRenderedNodes()[0].data.bookingStatus;
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setPerfChecked(checked);
    setValue(checked);
    const isBooking = checked;
    const isRehearsal = checked ? false : data.isRehearsal;
    const isGetInFitUp = checked ? false : data.isRehearsal;
    node.setData({
      ...data,
      perf: checked,
      dayType: GetDayType(checked),
      bookingStatus: GetBookingStatus(checked),
      pencilNo: null,
      // noPerf: GetNoPerf(checked),
      isBooking,
      isRehearsal,
      isGetInFitUp,
    });
  };

  return (
    <CheckboxRenderer
      eGridCell={eGridCell}
      name="perfCheckbox"
      checked={perfChecked}
      onChange={handleCheckboxChange}
      id="perf"
    />
  );
};
export default CheckPerfRenderer;
