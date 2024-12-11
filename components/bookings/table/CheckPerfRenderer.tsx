import { ICellRendererParams, IRowNode } from 'ag-grid-community';
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
  const perfomanceDayType = dayTypeOptions.find(({ text }) => text === 'Performance').value;

  useEffect(() => {
    const isChecked = data.perf || data.dayType === perfomanceDayType;
    setValue(isChecked);
    setPerfChecked(isChecked);
  }, [data, dayTypeOptions]);

  const getDayType = (checked: boolean): string | number | boolean => {
    if (checked) {
      return perfomanceDayType; // Set default dayType for check of permance
    } else {
      if (node.rowIndex === 0) {
        return dayTypeOptions.find(({ text }) => text === 'TBA').value; // Set default dayType for uncheck of performance for top row only
      }
      return dayTypeOptions.find(({ text }) => text === 'Day Off').value; // Set default dayType for uncheck of permormance
    }
  };

  const getBookingStatus = (checked: boolean): string | number | boolean => {
    if (checked) {
      if (node.rowIndex === 0 && node.data.bookingStatus === null) {
        api.forEachNode((node: IRowNode) => node.setData({ ...node.data, bookingStatus: pencilledStatus }));
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
