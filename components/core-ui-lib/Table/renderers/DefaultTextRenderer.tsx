import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip, { TooltipProps } from 'components/core-ui-lib/Tooltip/Tooltip';
import { useState } from 'react';

interface CellRendererParams extends CustomCellRendererProps, TooltipProps {
  tpActive?: boolean;
  showIcon?: boolean;
  showText?: boolean;
  iconName?: string;
  iconColor?: string;
  iconStroke?: string;
}

export default function DefaultTextRenderer(props: CellRendererParams) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to handle mouse enter and show tooltip
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  // Function to handle mouse leave and hide tooltip
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div>
      {props.tpActive ? (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Tooltip
            title={props.title}
            body={props.body}
            position={props.position}
            useManualToggle={true}
            manualToggle={showTooltip}
            height={props.height}
            width={props.width}
          >
            <CellContent {...props} />
          </Tooltip>
        </div>
      ) : (
        <CellContent {...props} />
      )}
    </div>
  );
}

const CellContent = (props: CellRendererParams) => {
  return (
    <div>
      {props.showIcon && (
        <Icon iconName={props.iconName} variant="lg" fill={props.iconColor} stroke={props.iconStroke} />
      )}

      {props.showText && <div className="w-full h-full px-2 truncate">{props.value}</div>}
    </div>
  );
};
