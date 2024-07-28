import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import { IconProps } from 'components/core-ui-lib/Icon/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

interface CellRendererParams extends CustomCellRendererProps {
  tpActive?: boolean;
  tooltipPosition?: 'left' | 'right' | 'top' | 'bottom';
  iconProps?: IconProps;
}

const IconRenderer = (props: CellRendererParams) => {
  const { value, iconProps, tooltipPosition = 'left' } = props;

  return (
    <div className="w-full h-full flex items-center justify-center cursor-pointer">
      <Tooltip body={value} position={tooltipPosition} height="h-auto" width="w-32" disabled={!value}>
        <Icon {...iconProps} />
      </Tooltip>
    </div>
  );
};

export default IconRenderer;
