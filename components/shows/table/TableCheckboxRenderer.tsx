import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import { useEffect, useState } from 'react';
import Tooltip, { TooltipProps } from 'components/core-ui-lib/Tooltip/Tooltip';

interface CheckPerfRendererProps extends ICellRendererParams, TooltipProps {
  dayTypeOptions: SelectOption[];
  disabled?: boolean;
  tpActive?: boolean;
}

const TableCheckboxRenderer = ({
  eGridCell,
  data,
  node,
  setValue,
  value,
  colDef,
  disabled,
  tpActive = false,
  ...tooltipProps
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

  const checkboxElement = (
    <CheckboxRenderer
      className={classNames({ 'opacity-30': disabled })}
      disabled={disabled}
      eGridCell={eGridCell}
      checked={perfChecked}
      onChange={handleCheckboxChange}
      id="perf"
    />
  );

  return (
    <div>
      {tpActive ? (
        <Tooltip
          title={tooltipProps.title}
          body={tooltipProps.body}
          position={tooltipProps.position}
          height={tooltipProps.height}
          width={tooltipProps.width}
          bgColorClass={tooltipProps.bgColorClass}
        >
          {checkboxElement}
        </Tooltip>
      ) : (
        checkboxElement
      )}
    </div>
  );
};

export default TableCheckboxRenderer;
