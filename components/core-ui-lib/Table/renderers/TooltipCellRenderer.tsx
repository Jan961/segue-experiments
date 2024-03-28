import { FC, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { TooltipProps } from 'components/core-ui-lib/Tooltip/Tooltip';

interface CellRendererTooltipParams extends ICellRendererParams, TooltipProps {}

const TooltipCellRenderer: FC<CellRendererTooltipParams> = (props) => {
  // State to control tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to handle mouse enter and show tooltip
  const handleMouseEnter = () => setShowTooltip(true);

  // Function to handle mouse leave and hide tooltip
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Tooltip
        title="Tooltip Title"
        body={props.value}
        position={props.position}
        useManualToggle={true}
        manualToggle={showTooltip}
      >
        <div>{props.value}</div>
      </Tooltip>
    </div>
  );
};

export default TooltipCellRenderer;
