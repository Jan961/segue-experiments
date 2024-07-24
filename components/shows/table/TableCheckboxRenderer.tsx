import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import { useEffect, useState } from 'react';

interface CheckPerfRendererProps extends ICellRendererParams {
  dayTypeOptions: SelectOption[];
  disabled?: boolean;
}

const TableCheckboxRenderer = ({
  eGridCell,
  data,
  node,
  setValue,
  value,
  colDef,
  disabled,
}: CheckPerfRendererProps) => {
  const [perfChecked, setPerfChecked] = useState<boolean>(false);

  useEffect(() => {
    setValue(value);
    setPerfChecked(value);
  }, [value]);

  const handleCheckboxChange = (checked) => {
    setPerfChecked(checked);
    setValue(checked);
    node.setData({
      ...data,
      [colDef?.field]: checked,
    });
  };

  return (
    <CheckboxRenderer
      className={classNames({ 'opacity-30': disabled })}
      disabled={disabled}
      eGridCell={eGridCell}
      checked={perfChecked}
      onChange={handleCheckboxChange}
      id="perf"
    />
  );
};
export default TableCheckboxRenderer;
