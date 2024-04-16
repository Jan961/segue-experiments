import { ICellRendererParams } from 'ag-grid-community';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import { statusOptions } from 'config/bookings';
import { useEffect, useState } from 'react';

interface CheckPerfRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
}

const CheckPerfRenderer = ({ eGridCell, data, dayTypeOptions, node, setValue }: CheckPerfRendererProps) => {
  const [perfChecked, setPerfChecked] = useState(false);
  const performanceOption = dayTypeOptions?.find(({ text }) => text === 'Performance');
  const pencilledStatus = statusOptions.find(({ text }) => text === 'Pencilled').value;

  useEffect(() => {
    const isChecked = data.perf || (performanceOption && data.dayType === performanceOption.value);
    setValue(isChecked);
    setPerfChecked(isChecked);
  }, [data, dayTypeOptions]);

  const handleCheckboxChange = (checked) => {
    setPerfChecked(checked);
    setValue(checked);
    const isBooking = checked;
    const isRehearsal = checked ? false : data.isRehearsal;
    const isGetInFitUp = checked ? false : data.isRehearsal;
    node.setData({
      ...data,
      perf: checked,
      dayType: checked ? performanceOption.value : '',
      bookingStatus: checked ? pencilledStatus : '',
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
