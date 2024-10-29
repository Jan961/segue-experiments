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

  const getDayType = (checked: boolean) => {
    if (checked) {
      return dayTypeOptions.find(({ text }) => text === 'Performance').value; // Performance Code
    } else {
      if (node.rowIndex === 0) {
        return dayTypeOptions.find(({ text }) => text === 'TBA').value; // TBA code
      }
      return dayTypeOptions.find(({ text }) => text === 'Day Off').value; // Day off Code
    }
  };

  const getBookingStatus = (checked: boolean) => {
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
      dayType: getDayType(checked),
      bookingStatus: getBookingStatus(checked),
      pencilNo: null,
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
