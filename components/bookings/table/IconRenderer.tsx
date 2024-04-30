import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

const IconRenderer = (props: CustomCellRendererProps) => {
  const { value } = props;
  const { iconName, tooltipPosition = 'left' } = props?.colDef?.cellRendererParams || {};

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Tooltip body={value} position={tooltipPosition} height="h-auto" width="w-32" disabled={!value}>
        <Icon iconName={iconName} />
      </Tooltip>
    </div>
  );
};

export default IconRenderer;
